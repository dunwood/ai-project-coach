// 项目状态管理 — localStorage key
var PROJECTS_KEY = 'ai_coach_projects';

// 获取所有项目（按更新时间倒序）
function getAllProjects() {
  try {
    var data = localStorage.getItem(PROJECTS_KEY);
    var projects = data ? JSON.parse(data) : [];
    return projects.sort(function (a, b) {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
  } catch (e) {
    return [];
  }
}

// 根据 ID 获取单个项目
function getProject(id) {
  var projects = getAllProjects();
  return projects.find(function (p) { return p.id === id; }) || null;
}

// 创建新项目（传入 title 和 idea）
function createProject(title, idea) {
  var projects = getAllProjects();
  var now = new Date().toISOString();
  var project = {
    id: 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    title: title,
    idea: idea,
    stage: 'idea',
    created_at: now,
    updated_at: now,
    clarify_answers: null,
    design_doc: null,
    task_plan: null
  };
  projects.push(project);
  _saveProjects(projects);
  return project;
}

// 更新项目（传入 id 和要更新的字段对象）
function updateProject(id, updates) {
  var projects = getAllProjects();
  var index = projects.findIndex(function (p) { return p.id === id; });
  if (index === -1) return null;
  updates.updated_at = new Date().toISOString();
  projects[index] = Object.assign({}, projects[index], updates);
  _saveProjects(projects);
  return projects[index];
}

// 删除项目（传入 id）
function deleteProject(id) {
  var projects = getAllProjects();
  var filtered = projects.filter(function (p) { return p.id !== id; });
  _saveProjects(filtered);
}

// 导出所有项目为 JSON 字符串
function exportProjects() {
  return JSON.stringify(getAllProjects(), null, 2);
}

// 导入项目（传入 JSON 字符串，合并到现有数据，相同 id 不覆盖）
function importProjects(jsonString) {
  var incoming = JSON.parse(jsonString);
  if (!Array.isArray(incoming)) throw new Error('Invalid format');
  var existing = getAllProjects();
  var existingIds = existing.map(function (p) { return p.id; });
  var merged = existing.slice();
  incoming.forEach(function (p) {
    if (!existingIds.includes(p.id)) {
      merged.push(p);
    }
  });
  _saveProjects(merged);
  return merged.length - existing.length; // 返回新增数量
}

// 内部：保存数组到 localStorage
function _saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}
