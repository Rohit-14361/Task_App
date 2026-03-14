const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const authEndpoints = {
  SIGNUP_API: BASE_URL + "/signup",
  LOGIN_API: BASE_URL + "/login",
};

export const taskEndpoints = {
  GET_ALL_TASKS_API: BASE_URL + "/get-all-tasks",
  CREATE_TASK_API: BASE_URL + "/create-task",
  UPDATE_TASK_API: BASE_URL + "/update-task",
  DELETE_TASK_API: BASE_URL + "/delete-task",
};
