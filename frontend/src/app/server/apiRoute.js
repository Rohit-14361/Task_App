const NEXT_URL=process.env.NEXT_PUBLIC_API_URL;

const userEndpoints={
    signup:NEXT_URL+"/api/v1/signup",
    login:NEXT_URL+"/api/v1/login"
}


const taskEndpoints={
    createTask:NEXT_URL+'/api/v1/create-task',
    updateTask:NEXT_URL+'/api/v1/update-task/:taskId',
    deleteTask:NEXT_URL+'/api/v1/delete-task/:taskId',
    getAllTask:NEXT_URL+'/api/v1/get-all-tasks',
    getTaskById:NEXT_URL+"/api/v1/get-task-by-id/:id"
}