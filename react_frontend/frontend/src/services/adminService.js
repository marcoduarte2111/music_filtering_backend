// src/services/adminService.js

let api;

export const setApi = (instance) => {
  api = instance;
};

// --- OBTENER LISTA DE USUARIOS ---
export const getAllUsers = async () => {
  try {
    const response = await api.get(`/v1/admin/users`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener lista de usuarios:", error);
    throw error.response?.data || { detail: "No se pudo obtener la lista de usuarios" };
  }
};

// --- ELIMINAR USUARIO ---
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/v1/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error.response?.data || { detail: "No se pudo eliminar el usuario" };
  }
};

// --- CAMBIAR ROL DE USUARIO ---
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/v1/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar rol del usuario:", error);
    throw error.response?.data || { detail: "No se pudo actualizar el rol del usuario" };
  }
};

// --- OBTENER ESTADÍSTICAS DEL SISTEMA ---
export const getSystemStats = async () => {
  try {
    const response = await api.get(`/v1/admin/stats`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    throw error.response?.data || { detail: "No se pudieron obtener las estadísticas" };
  }
};

// --- MONITOREO DE USO DEL SISTEMA ---
export const getSystemLogs = async () => {
  try {
    const response = await api.get(`/v1/admin/logs`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener logs del sistema:", error);
    throw error.response?.data || { detail: "No se pudieron obtener los registros del sistema" };
  }
};
