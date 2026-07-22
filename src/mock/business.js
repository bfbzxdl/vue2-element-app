var STORAGE_KEY = "vue2_business_users";

var defaultUsers = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "admin", status: "active", createdAt: "2026-01-15", region: ["440000", "440100", "440106"], regionLabels: ["广东省", "广州市", "天河区"], profile: "简历_张三.pdf" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "user", status: "active", createdAt: "2026-02-20", region: ["310000", "310100", "310101"], regionLabels: ["上海市", "上海市", "黄浦区"], profile: "" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "editor", status: "active", createdAt: "2026-03-10", region: [], regionLabels: [], profile: "作品集_王五.pdf" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "user", status: "inactive", createdAt: "2026-03-22", region: [], regionLabels: [], profile: "" },
  { id: 5, name: "孙七", email: "sunqi@example.com", role: "admin", status: "active", createdAt: "2026-04-05", region: ["440000", "440300", "440305"], regionLabels: ["广东省", "深圳市", "南山区"], profile: "备注_孙七.docx" },
  { id: 6, name: "周八", email: "zhouba@example.com", role: "editor", status: "active", createdAt: "2026-04-18", region: ["320000", "320100", "320102"], regionLabels: ["江苏省", "南京市", "玄武区"], profile: "" },
  { id: 7, name: "吴九", email: "wujiu@example.com", role: "user", status: "active", createdAt: "2026-05-01", region: [], regionLabels: [], profile: "" },
  { id: 8, name: "郑十", email: "zhengshi@example.com", role: "user", status: "inactive", createdAt: "2026-05-12", region: [], regionLabels: [], profile: "" },
  { id: 9, name: "陈明", email: "chenming@example.com", role: "editor", status: "active", createdAt: "2026-06-01", region: ["440000", "440100"], regionLabels: ["广东省", "广州市"], profile: "报告_陈明.pdf" },
  { id: 10, name: "林蕴", email: "linlin@example.com", role: "admin", status: "active", createdAt: "2026-06-15", region: ["310000", "310100"], regionLabels: ["上海市", "上海市"], profile: "" },
  { id: 11, name: "黄强", email: "huangqiang@example.com", role: "user", status: "active", createdAt: "2026-06-20", region: [], regionLabels: [], profile: "" },
  { id: 12, name: "杨红", email: "yanghong@example.com", role: "user", status: "inactive", createdAt: "2026-07-01", region: [], regionLabels: [], profile: "" },
];

function loadUsers() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) { /* localStorage may be unavailable */ }
  return null;
}

function saveUsers(users) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch (_) { /* localStorage may be unavailable */ }
}

export function getUsers() {
  var data = loadUsers();
  if (!data) {
    data = JSON.parse(JSON.stringify(defaultUsers));
    saveUsers(data);
  }
  return data;
}

export function addUser(data) {
  var users = getUsers();
  users.unshift(data);
  saveUsers(users);
  return data;
}

export function updateUser(id, data) {
  var users = getUsers();
  var idx = -1;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) { idx = i; break; }
  }
  if (idx < 0) throw new Error("User not found");
  Object.keys(data).forEach(function(k) { users[idx][k] = data[k]; });
  saveUsers(users);
  return users[idx];
}

export function removeUser(id) {
  var users = getUsers();
  var idx = -1;
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) { idx = i; break; }
  }
  if (idx < 0) throw new Error("User not found");
  users.splice(idx, 1);
  saveUsers(users);
  return { success: true };
}
