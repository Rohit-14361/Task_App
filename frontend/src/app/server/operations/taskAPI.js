import { apiConnector } from '../apiConnector.js'
import { taskEndpoints } from '../apiRoute.js'

export async function createTask(taskData, token) {
  try {
    const response = await apiConnector('POST', taskEndpoints.createTask, taskData, {
      Authorization: `Bearer ${token}`
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || 'Create task failed')
    }
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error?.response?.data?.message || 'Create task failed' }
  }
}

export async function getAllTasks(token) {
  try {
    const response = await apiConnector('GET', taskEndpoints.getAllTask, null, {
      Authorization: `Bearer ${token}`
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error?.response?.data?.message || 'Failed to fetch tasks' }
  }
}

export async function updateTask(taskId, taskData, token) {
  try {
    const url = taskEndpoints.updateTask.replace(':taskId', taskId)
    const response = await apiConnector('PUT', url, taskData, {
      Authorization: `Bearer ${token}`
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error?.response?.data?.message || 'Update failed' }
  }
}

export async function deleteTask(taskId, token) {
  try {
    const url = taskEndpoints.deleteTask.replace(':taskId', taskId)
    const response = await apiConnector('DELETE', url, null, {
      Authorization: `Bearer ${token}`
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error?.response?.data?.message || 'Delete failed' }
  }
}

export async function getTaskById(taskId, token) {
  try {
    const url = taskEndpoints.getTaskById.replace(':id', taskId)
    const response = await apiConnector('GET', url, null, {
      Authorization: `Bearer ${token}`
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error?.response?.data?.message || 'Task not found' }
  }
}

