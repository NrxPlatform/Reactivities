import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity, ActivityFormValues } from "../models/activity";
import { PaginatedResult } from "../models/pagination";
import { Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { UserActivity } from "../models/userActivity";
import { router } from "../router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    if(process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers["pagination"];
    if (pagination){
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response; 
}, (error: AxiosError) => {
        const {data, status, config, headers} = error.response as AxiosResponse;
        switch(status){
            case 400:
                if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                    router.navigate('/not-found');
                }
                if(data.errors){
                    const modalStateErorrs = [];
                    for (const key in data.errors){
                        if (data.errors[key]){
                            modalStateErorrs.push(data.errors[key])
                        }
                    }
                    throw modalStateErorrs.flat();
                }else{
                    toast.error(data);
                }
                break;
            case 401:
                if (status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')){
                    store.userStore.logout();
                    toast.error('Session expired - please login again')
                }
                toast.error('unauthorized');
                break;
            case 403:
                toast.error('forbidden');
                break;
            case 404:
                router.navigate('/not-found');
                break;
            case 500:
                store.commonStore.setServerError(data);
                router.navigate('/server-error');
                break;
            default:
                break;
        }
        return Promise.reject(error);
});



const request = {
    get : <T>(url : string, params? : URLSearchParams) => axios.get<T>(url, params && {params}).then(responseBody),
    post : <T>(url : string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put : <T>(url : string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete : <T>(url : string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list : (params: URLSearchParams) => request.get<PaginatedResult<Activity[]>>('/activities', params),
    details : (id : string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => request.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.delete<void>(`/activities/${id}`),
    attend: (id: string) => request.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current : () => request.get<User>('/account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user),
    refreshToken: () => request.post<User>('/account/refreshToken', {})
}

const Profiles = {
    get: (username: string) => request.get<Profile>(`/profiles/${username}`),
    uploadPhoto : (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post('photos', formData, {
            headers: {'Content-type': 'multipart/form-date'}
        })
    },
    setMainPhoto: (id:string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => request.put('/profiles', profile),
    updateFollowing: (username: string) => request.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) =>
        request.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => 
        request.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
    
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;