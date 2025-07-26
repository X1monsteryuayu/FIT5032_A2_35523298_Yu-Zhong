// 检查并初始化默认管理员账号
export function initializeDefaultUsers() {
  const adminEmail = 'admin@healthypathway.com';
  const adminData = {
    name: '系统管理员',
    email: adminEmail,
    password: 'Admin@123',
    role: 'admin',
    registeredAt: new Date().toISOString(),
    active: true
  };

  // 如果管理员账号不存在，创建它
  if (!localStorage.getItem(adminEmail)) {
    localStorage.setItem(adminEmail, JSON.stringify(adminData));
    console.log('Default admin account created');
  }
}

// 获取所有用户列表
export function getAllUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // 排除非用户数据
    if (key !== 'healthyPathwayResources' && key !== 'userInfo') {
      try {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData && userData.email) { // 确保是用户数据
          users.push({
            id: userData.email,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'user',
            active: userData.active !== false,
            joinedDate: new Date(userData.registeredAt).toLocaleDateString('zh-CN'),
            lastLogin: userData.lastLogin || '未登录',
            totalRatings: userData.totalRatings || 0,
            totalComments: userData.totalComments || 0
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }
  return users;
}

// 更新用户状态
export function updateUserStatus(email, status) {
  try {
    const userData = JSON.parse(localStorage.getItem(email));
    if (userData) {
      userData.active = status;
      localStorage.setItem(email, JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating user status:', e);
    return false;
  }
}

// 更新用户角色
export function updateUserRole(email, role) {
  try {
    const userData = JSON.parse(localStorage.getItem(email));
    if (userData) {
      userData.role = role;
      localStorage.setItem(email, JSON.stringify(userData));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error updating user role:', e);
    return false;
  }
}

// 删除用户
export function deleteUser(email) {
  try {
    const userData = JSON.parse(localStorage.getItem(email));
    if (userData && userData.role !== 'admin') {
      localStorage.removeItem(email);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error deleting user:', e);
    return false;
  }
}
