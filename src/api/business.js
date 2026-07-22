import { getUsers, addUser, updateUser, removeUser } from "@/mock/business"

function delay(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

export async function fetchUserList(params) {
  await delay(400);
  var keyword = (params.keyword || "").trim().toLowerCase();
  var role = params.role || "";
  var status = params.status || "";
  var region = params.region || [];
  var page = params.page || 1;
  var pageSize = params.pageSize || 10;

  var users = getUsers();
  var filtered = users.filter(function(u) {
    if (keyword && u.name.indexOf(keyword) < 0 && u.email.toLowerCase().indexOf(keyword) < 0) return false;
    if (role && u.role !== role) return false;
    if (status && u.status !== status) return false;
    if (region.length > 0) {
      for (var i = 0; i < region.length; i++) {
        if (!u.region || u.region[i] !== region[i]) return false;
      }
    }
    return true;
  });

  var total = filtered.length;
  var start = (page - 1) * pageSize;
  return { list: filtered.slice(start, start + pageSize), total: total };
}

export function createUser(data) {
  return addUser(data);
}

export function saveUser(id, data) {
  return updateUser(id, data);
}

export function deleteUser(id) {
  return removeUser(id);
}
