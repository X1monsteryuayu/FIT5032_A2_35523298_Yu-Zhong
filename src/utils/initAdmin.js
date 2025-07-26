export function initializeAdmin() {
  const adminEmail = 'admin@healthypathway.com';
  const existingAdmin = localStorage.getItem(adminEmail);

  if (!existingAdmin) {
    const adminData = {
      name: 'System Admin',
      email: adminEmail,
      password: 'Admin@123', // 在实际应用中应该使用更安全的方式
      role: 'admin',
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem(adminEmail, JSON.stringify(adminData));
    console.log('Default admin account created');
  }
}
