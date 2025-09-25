// src/services/cookieService.ts
export const cookieService = {
    // Guardar cookie
    setCookie: (name: string, value: string, days: number = 1) => {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
    },

    // Leer cookie
    getCookie: (name: string): string | null => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },

    // Eliminar cookie
    deleteCookie: (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },

    // Guardar usuario (objeto JSON)
    setUser: (user: object, days: number = 1) => {
        cookieService.setCookie("user", JSON.stringify(user), days);
    },

    // Leer usuario
    getUser: (): object | null => {
        const userCookie = cookieService.getCookie("user");
        return userCookie ? JSON.parse(userCookie) : null;
    },

    // Guardar token
    setToken: (token: string, days: number = 1) => {
        cookieService.setCookie("token", token, days);
    },

    // Leer token
    getToken: (): string | null => {
        return cookieService.getCookie("token");
    },

    // Eliminar token y usuario
    clearAuth: () => {
        cookieService.deleteCookie("token");
        cookieService.deleteCookie("user");
    }
};
