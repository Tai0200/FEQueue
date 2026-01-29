import { fetchWithTokenRetry } from "../../helpers/tokens";

// Hàm định dạng ngày tháng 
export const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

export const getProvidedNumber = async (serviceCode: string, start: string, end: string, deviceCode: string, searchText: string, pageNumber: number, pageSize: number, status: string):
    Promise<any> => {
    const userName = localStorage.getItem('userName');
    const url = `${process.env.REACT_APP_API_URL}api/Assignment/${userName}/${serviceCode}/${start}/${end}/${deviceCode}/${searchText}/${pageNumber}/${pageSize}/${status}`;

    try {
        const response = await fetchWithTokenRetry(url);
        if (response.ok) {
            const data = await response.json();
            return data.map((item: any) => ({
                ...item,
                assignmentDate: formatDate(item.assignmentDate),
                expireDate: formatDate(item.expireDate)
            }));
        }
        console.error("Failed to fetch provided number, status:", response.status);
        return [];
    } catch (error) {
        console.error("Error in getProvidedNumber:", error);
        return [];
    }
}

export const getDeviceData = async (): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL}api/Device/`;
    try {
        const response = await fetchWithTokenRetry(url);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error fetching device data:", error);
        return [];
    }
}

export const getUserData = async (): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL}api/Authenticate`;
    try {
        const response = await fetchWithTokenRetry(url);
        if (response.ok) {
            return await response.json();
        }
        return response; // Trả về response object để xử lý lỗi ở UI
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

export const getServiceData = async (): Promise<any> => {
    const url = `${process.env.REACT_APP_API_URL}api/Service/`;
    try {
        const response = await fetchWithTokenRetry(url);
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error fetching service data:", error);
        return [];
    }
}

export const getTotalNumber = async (serviceCode: string, start: string, end: string, deviceCode: string, searchText: string, status: string): Promise<number> => {
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    const url = `${process.env.REACT_APP_API_URL}api/Assignment/count/${userName}/${serviceCode}/${start}/${end}/${deviceCode}/${searchText}/${status}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Count API failed");
        return await response.json();
    } catch (error) {
        console.error("Error in getTotalNumber:", error);
        return 0;
    }
}