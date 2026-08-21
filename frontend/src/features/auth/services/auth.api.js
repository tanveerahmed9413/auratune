import axios from "axios"

let api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})


export async function register({email,username,password}){
    let response = await api.post('/api/auth/register',{
        email,username,password
    })
    return response.data
}
export async function login({email,username,password}){
    let response = await api.post('/api/auth/login',{
        email,username,password
    })
    return response.data
}
export async function getMe(){
    let response = await api.get("/api/auth/get-me")
    return response.data
}
export async function logout(){
    let response = await api.get('/api/auth/logout')
    return response.data
}