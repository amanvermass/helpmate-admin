export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";

export interface ApiAdmin {
  _id: string;
  adminId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export async function adminLoginApi(payload: { identifier: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("adminLoginApi error:", error);
    return { success: false, message: "Failed to connect to backend server." };
  }
}

export function getAuthHeaders(extraHeaders: Record<string, string> = {}, isFormData: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {
    ...extraHeaders,
  };
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("helpmate_admin_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = getAuthHeaders(options.headers as Record<string, string>, isFormData);
  return fetch(url, {
    ...options,
    headers,
  });
}

// ─── IN-MEMORY API RESPONSE CACHE ───
const apiCache = new Map<string, any>();

function getFromCache(cacheKey: string, forceRefresh?: boolean) {
  if (forceRefresh) {
    apiCache.delete(cacheKey);
    return null;
  }
  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (cached && cached.success !== false) {
      return cached;
    }
    apiCache.delete(cacheKey);
  }
  return null;
}

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.startsWith(prefix) || key.includes(prefix)) {
      apiCache.delete(key);
    }
  }
}

export function invalidateCatalogCache() {
  clearApiCache("getServices");
  clearApiCache("getPackages");
  clearApiCache("getCategories");
  clearApiCache("getCategoryDropdown");
  clearApiCache("getServiceActions");
  clearApiCache("getAddons");
}

// ─── LOCALITY APIS ───

export interface ApiLocality {
  _id: string;
  localityName: string;
  pincode: string;
  status: boolean;
}

export async function getLocalitiesApi(params?: { search?: string; limit?: number; forceRefresh?: boolean }) {
  const cacheKey = `getLocalitiesApi:${JSON.stringify(params || {})}`;
  if (!params?.forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    query.append("limit", String(params?.limit || 100));

    const res = await fetch(`${API_BASE_URL}/locality?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getLocalitiesApi error:", error);
    return { success: false, message: "Failed to fetch localities." };
  }
}

export interface ApiCategory {
  _id: string;
  categoryName: string;
  slug: string;
  iconUrl?: string;
  subCategories: { _id?: string; name: string }[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiAddon {
  _id: string;
  categoryId?: string;
  subCategoryId?: string;
  addonName?: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
  imageUrl?: string;
  category: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiServiceActionHierarchy {
  _id?: string;
  serviceAction?: string;
  serviceName?: string;
  subtitle?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  package?: any;
  addons?: (string | ApiAddon)[];
}

export interface ApiSubCategoryHierarchy {
  _id?: string;
  name?: string;
  serviceAction?: ApiServiceActionHierarchy;
}

export interface ApiCategoryHierarchy {
  _id?: string;
  categoryName?: string;
  iconUrl?: string;
  subCategory?: ApiSubCategoryHierarchy;
}

export interface ApiService {
  _id: string;
  category?: ApiCategoryHierarchy;
  categoryId: string | { _id: string; categoryName: string; subCategories?: { _id: string; name: string }[] };
  categoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
  serviceName: string;
  serviceAction?: string;
  subtitle?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  package?: any;
  addons?: (string | ApiAddon)[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── CATEGORY APIS ───

export async function getCategoriesApi(params?: { search?: string; status?: string; page?: number; limit?: number; forceRefresh?: boolean }) {
  const cacheKey = `getCategoriesApi:${JSON.stringify({ search: params?.search, status: params?.status, page: params?.page, limit: params?.limit })}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    query.append("limit", String(params?.limit || 100));

    const res = await fetch(`${API_BASE_URL}/category?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCategoriesApi error:", error);
    return { success: false, message: "Failed to connect to backend server." };
  }
}

export async function getCategoryDropdownApi(forceRefresh?: boolean) {
  const cacheKey = `getCategoryDropdownApi`;
  const cached = getFromCache(cacheKey, forceRefresh);
  if (cached) return cached;
  try {
    const res = await fetch(`${API_BASE_URL}/category/dropdown`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCategoryDropdownApi error:", error);
    return { success: false, message: "Failed to fetch category dropdown." };
  }
}

export async function createCategoryApi(
  payload:
    | FormData
    | {
      categoryName: string;
      slug: string;
      iconUrl?: string;
      subCategories?: Array<{ name: string }>;
      status?: boolean;
    }
) {
  clearApiCache("getCategoriesApi");
  clearApiCache("getCategoryDropdownApi");
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await authFetch(`${API_BASE_URL}/category`, {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("createCategoryApi error:", error);
    return { success: false, message: "Failed to create category." };
  }
}

export async function updateCategoryApi(
  id: string,
  payload:
    | FormData
    | {
      categoryName: string;
      slug: string;
      iconUrl?: string;
      subCategories?: Array<{ _id?: string; name: string }>;
      status?: boolean;
    }
) {
  clearApiCache("getCategoriesApi");
  clearApiCache("getCategoryDropdownApi");
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await authFetch(`${API_BASE_URL}/category/${id}`, {
      method: "PUT",
      body: isFormData ? payload : JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateCategoryApi error:", error);
    return { success: false, message: "Failed to update category." };
  }
}

export async function deleteCategoryApi(id: string) {
  clearApiCache("getCategoriesApi");
  clearApiCache("getCategoryDropdownApi");
  try {
    const res = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteCategoryApi error:", error);
    return { success: false, message: "Failed to delete category." };
  }
}

export async function toggleCategoryStatusApi(id: string, status?: boolean) {
  clearApiCache("getCategoriesApi");
  clearApiCache("getCategoryDropdownApi");
  try {
    const res = await fetch(`${API_BASE_URL}/category/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.error("toggleCategoryStatusApi error:", error);
    return { success: false, message: "Failed to toggle status." };
  }
}

// ─── SERVICE APIS ───

export async function getServicesApi(params?: {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  serviceAction?: string;
  forceRefresh?: boolean;
}) {
  const cacheKey = `getServicesApi:${JSON.stringify(params || {})}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.subCategoryId) query.append("subCategoryId", params.subCategoryId);
    if (params?.serviceAction) query.append("serviceAction", params.serviceAction);
    query.append("limit", String(params?.limit || 100));

    const res = await fetch(`${API_BASE_URL}/service?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getServicesApi error:", error);
    return { success: false, message: "Failed to connect to backend server." };
  }
}

export async function getServicesByActionApi(params?: {
  categoryId?: string;
  subCategoryId?: string;
  categoryName?: string;
  subCategoryName?: string;
  category?: string;
  subcategory?: string;
  serviceAction?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.subCategoryId) query.append("subCategoryId", params.subCategoryId);
    if (params?.categoryName) query.append("categoryName", params.categoryName);
    if (params?.subCategoryName) query.append("subCategoryName", params.subCategoryName);
    if (params?.category) query.append("category", params.category);
    if (params?.subcategory) query.append("subcategory", params.subcategory);
    if (params?.serviceAction) query.append("serviceAction", params.serviceAction);

    const res = await fetch(`${API_BASE_URL}/service/by-action?${query.toString()}`);
    return await res.json();
  } catch (error) {
    console.error("getServicesByActionApi error:", error);
    return { success: false, message: "Failed to fetch services by action." };
  }
}

export async function createServiceApi(payload: {
  categoryId?: string;
  subCategoryId?: string;
  serviceName?: string;
  serviceAction?: string;
  subtitle?: string;
  price?: number;
  originalPrice?: number;
  duration?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  package?: any;
  packageId?: any;
  addons?: string[];
  status?: boolean;
  category?: any;
}) {
  invalidateCatalogCache();
  try {
    const res = await fetch(`${API_BASE_URL}/service`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("createServiceApi error:", error);
    return { success: false, message: "Failed to create service." };
  }
}

export async function updateServiceApi(
  id: string,
  payload: {
    categoryId?: string;
    subCategoryId?: string;
    serviceName?: string;
    serviceAction?: string;
    subtitle?: string;
    price?: number;
    originalPrice?: number;
    duration?: string;
    thumbnailUrl?: string;
    imageUrl?: string;
    package?: any;
    packageId?: any;
    addons?: string[];
    status?: boolean;
    category?: any;
  }
) {
  invalidateCatalogCache();
  try {
    const res = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateServiceApi error:", error);
    return { success: false, message: "Failed to update service." };
  }
}

export async function deleteServiceApi(id: string) {
  invalidateCatalogCache();
  try {
    const res = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteServiceApi error:", error);
    return { success: false, message: "Failed to delete service." };
  }
}

export async function toggleServiceStatusApi(id: string, status?: boolean) {
  invalidateCatalogCache();
  try {
    const res = await fetch(`${API_BASE_URL}/service/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.error("toggleServiceStatusApi error:", error);
    return { success: false, message: "Failed to toggle status." };
  }
}

// ─── ADDON / SPARE PART APIS ───

export async function getAddonsApi(params?: { search?: string; category?: string; status?: string; forceRefresh?: boolean }) {
  const cacheKey = `getAddonsApi:${JSON.stringify({ search: params?.search, category: params?.category, status: params?.status })}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category) query.append("category", params.category);
    if (params?.status) query.append("status", params.status);

    const res = await authFetch(`${API_BASE_URL}/addon?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getAddonsApi error:", error);
    return { success: false, message: "Failed to fetch spare part add-ons." };
  }
}

export async function getAddonDropdownApi(params?: { categoryId?: string; subCategoryId?: string; forceRefresh?: boolean }) {
  const cacheKey = `getAddonDropdownApi:${JSON.stringify({ categoryId: params?.categoryId, subCategoryId: params?.subCategoryId })}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.subCategoryId) query.append("subCategoryId", params.subCategoryId);

    const res = await authFetch(`${API_BASE_URL}/addon/dropdown?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getAddonDropdownApi error:", error);
    return { success: false, message: "Failed to fetch addon dropdown options." };
  }
}

export async function createAddonApi(payload: {
  categoryId?: string;
  subCategoryId?: string;
  addonName?: string;
  title?: string;
  description?: string;
  price: number;
  unit?: string;
  imageUrl?: string;
  category?: string;
  status?: boolean;
}) {
  clearApiCache("getAddonsApi");
  try {
    const bodyPayload = {
      ...payload,
      addonName: payload.addonName || payload.title,
      title: payload.title || payload.addonName,
    };
    const res = await authFetch(`${API_BASE_URL}/addon`, {
      method: "POST",
      body: JSON.stringify(bodyPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("createAddonApi error:", error);
    return { success: false, message: "Failed to create spare part add-on." };
  }
}

export async function updateAddonApi(
  id: string,
  payload: {
    categoryId?: string;
    subCategoryId?: string;
    addonName?: string;
    title?: string;
    description?: string;
    price?: number;
    unit?: string;
    imageUrl?: string;
    category?: string;
    status?: boolean;
  }
) {
  clearApiCache("getAddonsApi");
  try {
    const bodyPayload = {
      ...payload,
      ...(payload.addonName || payload.title
        ? {
          addonName: payload.addonName || payload.title,
          title: payload.title || payload.addonName,
        }
        : {}),
    };
    const res = await authFetch(`${API_BASE_URL}/addon/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateAddonApi error:", error);
    return { success: false, message: "Failed to update spare part add-on." };
  }
}

export async function deleteAddonApi(id: string) {
  clearApiCache("getAddonsApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/addon/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteAddonApi error:", error);
    return { success: false, message: "Failed to delete spare part add-on." };
  }
}

export async function toggleAddonStatusApi(id: string, status?: boolean) {
  clearApiCache("getAddonsApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/addon/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (error) {
    console.error("toggleAddonStatusApi error:", error);
    return { success: false, message: "Failed to toggle status." };
  }
}

// ─── SERVICE ACTION APIS ───

export interface ApiServiceAction {
  _id: string;
  name: string;
  serviceAction?: string;
  serviceName?: string;
  categoryId?: any;
  categoryName?: string;
  subCategoryId?: any;
  subCategoryName?: string;
  subCategory?: any;
  price?: number;
  originalPrice?: number;
  duration?: any;
  thumbnailUrl?: string;
  imageUrl?: string;
  package?: any;
  addons?: any[];
  description?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getServiceActionsApi(
  params?: { categoryId?: string; subCategoryId?: string; categoryName?: string; subCategoryName?: string; forceRefresh?: boolean } | boolean
) {
  let categoryId = "";
  let subCategoryId = "";
  let categoryName = "";
  let subCategoryName = "";
  let forceRefresh = false;

  if (typeof params === "boolean") {
    forceRefresh = params;
  } else if (params && typeof params === "object") {
    categoryId = params.categoryId || "";
    subCategoryId = params.subCategoryId || "";
    categoryName = params.categoryName || "";
    subCategoryName = params.subCategoryName || "";
    forceRefresh = !!params.forceRefresh;
  }

  const queryParts: string[] = [];
  if (categoryId) queryParts.push(`categoryId=${encodeURIComponent(categoryId)}`);
  if (subCategoryId) queryParts.push(`subCategoryId=${encodeURIComponent(subCategoryId)}`);
  if (categoryName) queryParts.push(`categoryName=${encodeURIComponent(categoryName)}`);
  if (subCategoryName) queryParts.push(`subCategoryName=${encodeURIComponent(subCategoryName)}`);
  const queryString = queryParts.length ? `?${queryParts.join("&")}` : "";

  const cacheKey = `getServiceActionsApi_${queryString}`;
  const cached = getFromCache(cacheKey, forceRefresh);
  if (cached) return cached;
  try {
    const res = await authFetch(`${API_BASE_URL}/service-actions${queryString}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getServiceActionsApi error:", error);
    return { success: false, message: "Failed to fetch service actions." };
  }
}

export async function getServiceActionDropdownApi(params?: { categoryId?: string; subCategoryId?: string; forceRefresh?: boolean }) {
  const cacheKey = `getServiceActionDropdownApi:${JSON.stringify({ categoryId: params?.categoryId, subCategoryId: params?.subCategoryId })}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.subCategoryId) query.append("subCategoryId", params.subCategoryId);

    const res = await authFetch(`${API_BASE_URL}/service-actions/dropdown?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getServiceActionDropdownApi error:", error);
    return { success: false, message: "Failed to fetch service action dropdown options." };
  }
}

export async function createServiceActionApi(payload: {
  categoryId?: string;
  subCategoryId?: string;
  serviceAction?: string;
  name?: string;
  description?: string;
  status?: boolean;
}) {
  clearApiCache("getServiceActionsApi");
  try {
    const bodyPayload: any = {
      categoryId: payload.categoryId,
      serviceAction: payload.serviceAction || payload.name,
    };
    if (payload.subCategoryId) {
      bodyPayload.subCategoryId = payload.subCategoryId;
    }
    const res = await authFetch(`${API_BASE_URL}/service-actions`, {
      method: "POST",
      body: JSON.stringify(bodyPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("createServiceActionApi error:", error);
    return { success: false, message: "Failed to create service action." };
  }
}

export async function updateServiceActionApi(id: string, payload: { categoryId?: string; subCategoryId?: string; name?: string; serviceAction?: string; description?: string; status?: boolean }) {
  clearApiCache("getServiceActionsApi");
  try {
    const bodyPayload: any = { ...payload };
    if (bodyPayload.subCategoryId === "" || bodyPayload.subCategoryId === undefined) {
      delete bodyPayload.subCategoryId;
    }
    const res = await authFetch(`${API_BASE_URL}/service-action/${id}`, {
      method: "PUT",
      body: JSON.stringify(bodyPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateServiceActionApi error:", error);
    return { success: false, message: "Failed to update service action." };
  }
}

export async function deleteServiceActionApi(id: string) {
  clearApiCache("getServiceActionsApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/service-action/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteServiceActionApi error:", error);
    return { success: false, message: "Failed to delete service action." };
  }
}

// ─── PACKAGE APIS ───

export async function getPackagesApi(params?: {
  search?: string;
  limit?: number;
  serviceAction?: string;
  serviceActionId?: string;
  serviceId?: string;
  categoryId?: string;
  subCategoryId?: string;
  categoryName?: string;
  subCategoryName?: string;
  category?: string;
  subcategory?: string;
  forceRefresh?: boolean;
}) {
  const cacheKey = `getPackagesApi:${JSON.stringify(params || {})}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.serviceAction) query.append("serviceAction", params.serviceAction);
    if (params?.serviceActionId) query.append("serviceActionId", params.serviceActionId);
    if (params?.serviceId) query.append("serviceId", params.serviceId);
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.subCategoryId) query.append("subCategoryId", params.subCategoryId);
    if (params?.categoryName) query.append("categoryName", params.categoryName);
    if (params?.subCategoryName) query.append("subCategoryName", params.subCategoryName);
    if (params?.category) query.append("category", params.category);
    if (params?.subcategory) query.append("subcategory", params.subcategory);
    query.append("limit", String(params?.limit || 100));

    const res = await authFetch(`${API_BASE_URL}/package?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getPackagesApi error:", error);
    return { success: false, message: "Failed to fetch packages." };
  }
}

export async function getPackageDropdownApi(params?: string | {
  serviceId?: string;
  serviceAction?: string;
  categoryId?: string;
  subCategoryId?: string;
  categoryName?: string;
  subCategoryName?: string;
  category?: string;
  subcategory?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (typeof params === "string") {
      query.append("serviceId", params);
    } else if (params) {
      if (params.serviceId) query.append("serviceId", params.serviceId);
      if (params.serviceAction) query.append("serviceAction", params.serviceAction);
      if (params.categoryId) query.append("categoryId", params.categoryId);
      if (params.subCategoryId) query.append("subCategoryId", params.subCategoryId);
      if (params.categoryName) query.append("categoryName", params.categoryName);
      if (params.subCategoryName) query.append("subCategoryName", params.subCategoryName);
      if (params.category) query.append("category", params.category);
      if (params.subcategory) query.append("subcategory", params.subcategory);
    }
    const res = await authFetch(`${API_BASE_URL}/package/dropdown?${query.toString()}`);
    return await res.json();
  } catch (error) {
    console.error("getPackageDropdownApi error:", error);
    return { success: false, message: "Failed to fetch package dropdown." };
  }
}

export function cleanImagePayload(imgUrl?: string): string {
  if (!imgUrl) return "";
  return String(imgUrl).trim();
}

export async function createPackageApi(
  payload:
    | FormData
    | {
      serviceActionId?: string;
      packages?: Array<{
        packageName: string;
        subtitle?: string;
        description?: string;
        price: number;
        originalPrice?: number;
        duration: number | string;
        imageUrl?: string;
        thumbnailUrl?: string;
        addons?: string[];
      }>;
      serviceId?: string;
      categoryId?: string;
      subCategoryId?: string;
      serviceAction?: string;
      packageName?: string;
      description?: string;
      subtitle?: string;
      price?: number;
      duration?: number | string;
      originalPrice?: number;
      thumbnailUrl?: string;
      imageUrl?: string;
      addons?: string[];
      status?: boolean;
    }
) {
  clearApiCache("getPackagesApi");
  try {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

    let bodyData: BodyInit;

    if (isFormData) {
      bodyData = payload as FormData;
    } else {
      const pkgObj = payload as any;
      let finalPayload: any = pkgObj;
      if (Array.isArray(pkgObj.packages)) {
        finalPayload = {
          ...pkgObj,
          packages: pkgObj.packages.map((p: any) => ({
            ...p,
            imageUrl: cleanImagePayload(p.imageUrl || p.thumbnailUrl),
            thumbnailUrl: cleanImagePayload(p.thumbnailUrl || p.imageUrl),
          })),
        };
      } else if (!pkgObj.packages && (pkgObj.packageName || pkgObj.price !== undefined)) {
        const cleanedImg = cleanImagePayload(pkgObj.imageUrl || pkgObj.thumbnailUrl);
        const singlePkg = {
          packageName: pkgObj.packageName || "",
          subtitle: pkgObj.subtitle || "",
          description: pkgObj.description || "",
          price: Number(pkgObj.price) || 0,
          originalPrice: Number(pkgObj.originalPrice) || Number(pkgObj.price) || 0,
          duration: Number(pkgObj.duration) || 60,
          imageUrl: cleanedImg,
          thumbnailUrl: cleanedImg,
          addons: pkgObj.addons || [],
        };

        finalPayload = {
          serviceActionId: pkgObj.serviceActionId,
          packages: [singlePkg],
        };
      }
      bodyData = JSON.stringify(finalPayload);
    }

    const res = await authFetch(`${API_BASE_URL}/package`, {
      method: "POST",
      body: bodyData,
    });
    return await res.json();
  } catch (error) {
    console.error("createPackageApi error:", error);
    return { success: false, message: "Failed to create package." };
  }
}

export async function updatePackageApi(
  id: string,
  payload: {
    serviceId?: string;
    serviceActionId?: string;
    categoryId?: string;
    subCategoryId?: string;
    serviceAction?: string;
    packageName?: string;
    description?: string;
    subtitle?: string;
    price?: number;
    duration?: number | string;
    originalPrice?: number;
    thumbnailUrl?: string;
    imageUrl?: string;
    addons?: string[];
    status?: boolean;
  }
) {
  clearApiCache("getPackagesApi");
  const cleanedPayload = {
    ...payload,
    ...(payload.imageUrl !== undefined ? { imageUrl: cleanImagePayload(payload.imageUrl) } : {}),
    ...(payload.thumbnailUrl !== undefined ? { thumbnailUrl: cleanImagePayload(payload.thumbnailUrl) } : {}),
  };
  try {
    const res = await authFetch(`${API_BASE_URL}/package/${id}`, {
      method: "PATCH",
      body: JSON.stringify(cleanedPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("updatePackageApi error:", error);
    return { success: false, message: "Failed to update package." };
  }
}

export async function deletePackageApi(id: string) {
  clearApiCache("getPackagesApi");
  try {
    const res = await fetch(`${API_BASE_URL}/package/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deletePackageApi error:", error);
    return { success: false, message: "Failed to delete package." };
  }
}

// ─── BOOKING APIS ───

export interface ApiSelectedAddonPayload {
  addonId: string;
  quantity: number;
}

export interface ApiBookingItemPayload {
  categoryId: string;
  subCategoryId: string;
  serviceActionId: string;
  packageId: string;
  quantity: number;
  selectedAddons?: ApiSelectedAddonPayload[];
}

export interface ApiCreateBookingPayload {
  customerId: string;
  addressId: string;
  items: ApiBookingItemPayload[];
  partnerId?: string;
  bookingDate: string;
  timeSlot: string;
  paymentMethod: "cash" | "upi" | "card" | "wallet";
  bookingSource?: "admin" | "app" | "website";
}

export async function createBookingApi(payload: ApiCreateBookingPayload) {
  clearApiCache("getBookingsApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/booking`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("createBookingApi error:", error);
    return { success: false, message: "Failed to create booking." };
  }
}

export interface ApiBookingCategoryStat {
  _id: string;
  categoryName: string;
  totalBookings: number;
  openBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface ApiBookingCategoriesResponse {
  success: boolean;
  message?: string;
  data?: {
    allServices: {
      totalBookings: number;
      openBookings: number;
      activeBookings: number;
      completedBookings: number;
      cancelledBookings: number;
    };
    categories: ApiBookingCategoryStat[];
  };
}

export async function getBookingCategoriesApi(forceRefresh?: boolean) {
  const cacheKey = `getBookingCategoriesApi`;
  const cached = getFromCache(cacheKey, forceRefresh);
  if (cached) return cached;

  try {
    const res = await authFetch(`${API_BASE_URL}/booking/categories`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getBookingCategoriesApi error:", error);
    return { success: false, message: "Failed to fetch booking categories." };
  }
}

export async function getBookingsApi(params?: { categoryId?: string; search?: string; status?: string; page?: number; limit?: number; forceRefresh?: boolean }) {
  const cacheKey = `getBookingsApi:${JSON.stringify({ categoryId: params?.categoryId, search: params?.search, status: params?.status, page: params?.page, limit: params?.limit })}`;
  if (!params?.forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append("categoryId", params.categoryId);
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    if (params?.page) query.append("page", String(params.page));
    query.append("limit", String(params?.limit || 100));

    const res = await authFetch(`${API_BASE_URL}/booking?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getBookingsApi error:", error);
    return { success: false, message: "Failed to fetch bookings." };
  }
}

export async function getBookingDetailsApi(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/booking/${id}`);
    return await res.json();
  } catch (error) {
    console.error("getBookingDetailsApi error:", error);
    return { success: false, message: "Failed to fetch booking details." };
  }
}

export interface ApiUpdateBookingPayload {
  addressId: string;
  items: ApiBookingItemPayload[];
  partnerId?: string;
  bookingDate: string;
  timeSlot: string;
}

export async function updateBookingApi(id: string, payload: ApiUpdateBookingPayload) {
  clearApiCache("getBookingsApi");
  try {
    const res = await fetch(`${API_BASE_URL}/booking/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateBookingApi error:", error);
    return { success: false, message: "Failed to update booking." };
  }
}

// ─── CUSTOMER APIS ───

export interface ApiCustomerDropdownItem {
  _id: string;
  customerCode?: string;
  fullName: string;
  mobile: string;
  email?: string;
}

export async function getCustomerDropdownApi(params?: { search?: string; forceRefresh?: boolean }) {
  const cacheKey = `getCustomerDropdownApi:${JSON.stringify(params || {})}`;
  if (!params?.forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    query.append("limit", "100");

    const res = await fetch(`${API_BASE_URL}/admin/customer/dropdown?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCustomerDropdownApi error:", error);
    return { success: false, message: "Failed to fetch customer dropdown." };
  }
}

export interface ApiCreateCustomerPayload {
  fullName: string;
  mobile: string;
  alternatePhone?: string;
  email?: string;
  customerCategory?: string;
  propertyHouseholdType?: string;
  address: {
    addressLabel: string;
    relationshipType: "self" | "family_member" | "friend_neighbor" | "office_work" | "other_person";
    localityId: string;
    pincode: string;
    serviceAddress: string;
    landmark?: string;
  };
}

export async function createCustomerApi(payload: ApiCreateCustomerPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/customer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: payload.fullName,
        mobile: payload.mobile,
        alternatePhone: payload.alternatePhone || "",
        email: payload.email || "",
        customerCategory: payload.customerCategory || "individual_household",
        propertyHouseholdType: payload.propertyHouseholdType || "apartment_flat",
        address: {
          addressLabel: payload.address.addressLabel || "Home (Primary)",
          relationshipType: payload.address.relationshipType || "self",
          localityId: payload.address.localityId,
          pincode: payload.address.pincode || "221002",
          serviceAddress: payload.address.serviceAddress || "Varanasi",
          landmark: payload.address.landmark || "",
        },
      }),
    });
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.clear();
    }
    return data;
  } catch (error) {
    console.error("createCustomerApi error:", error);
    return { success: false, message: "Failed to create customer." };
  }
}

export interface ApiAdminCustomerItem {
  _id: string;
  customerCode?: string;
  fullName: string;
  mobile: string;
  alternatePhone?: string;
  email?: string;
  customerCategory?: string;
  propertyHouseholdType?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  primaryAddress?: {
    _id?: string;
    addressLabel?: string;
    relationshipType?: string;
    localityId?: {
      _id?: string;
      localityName?: string;
      pincode?: string;
    } | string;
    pincode?: string;
    serviceAddress?: string;
    landmark?: string;
  };
}

export async function getAdminCustomersApi(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  forceRefresh?: boolean;
}) {
  const cacheKey = `getAdminCustomersApi:${JSON.stringify(params || {})}`;
  if (!params?.forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);
    if (params?.status !== undefined) query.append("status", String(params.status));

    const res = await fetch(`${API_BASE_URL}/admin/customer?${query.toString()}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getAdminCustomersApi error:", error);
    return { success: false, message: "Failed to fetch customers." };
  }
}

export async function updateCustomerApi(id: string, payload: ApiCreateCustomerPayload & { status?: boolean }) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/customer/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.clear();
    }
    return data;
  } catch (error) {
    console.error("updateCustomerApi error:", error);
    return { success: false, message: "Failed to update customer." };
  }
}

export async function deleteCustomerApi(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/customer/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.clear();
    }
    return data;
  } catch (error) {
    console.error("deleteCustomerApi error:", error);
    return { success: false, message: "Failed to delete customer." };
  }
}



export async function sendBookingCustomerOtpApi(payload: { customerId?: string; mobile?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/booking/customer/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok && payload.mobile) {
      // Fallback to customer auth send-otp
      return await sendCustomerOtpApi({ mobile: payload.mobile });
    }
    return data;
  } catch (error) {
    console.error("sendBookingCustomerOtpApi error:", error);
    if (payload.mobile) {
      return await sendCustomerOtpApi({ mobile: payload.mobile });
    }
    return { success: false, message: "Failed to send OTP." };
  }
}

export async function verifyBookingCustomerOtpApi(payload: { customerId?: string; mobile?: string; otp: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/booking/customer/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("verifyBookingCustomerOtpApi error:", error);
    return { success: false, message: "Failed to verify OTP." };
  }
}

export async function sendCustomerOtpApi(payload: { mobile: string; customerId?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/customer/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("sendCustomerOtpApi error:", error);
    return { success: false, message: "Failed to send OTP." };
  }
}

export async function getCustomerTrustStatusApi(customerId: string, forceRefresh?: boolean) {
  const cacheKey = `getCustomerTrustStatusApi:${customerId}`;
  if (!forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const res = await fetch(`${API_BASE_URL}/customer-trust/${customerId}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCustomerTrustStatusApi error:", error);
    return { success: false, message: "Failed to fetch customer trust status." };
  }
}


// ─── CUSTOMER ADDRESS APIS ───


export interface ApiCustomerAddressPayload {
  customerId: string;
  addressLabel: string;
  relationshipType: "self" | "family_member" | "friend_neighbor" | "office_work" | "other_person";
  localityId: string;
  pincode: string;
  serviceAddress: string;
  landmark?: string;
  isPrimary?: boolean;
}

export async function createCustomerAddressApi(payload: ApiCustomerAddressPayload) {
  clearApiCache("getCustomerAddressesApi");
  try {
    const res = await fetch(`${API_BASE_URL}/customer-address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("createCustomerAddressApi error:", error);
    return { success: false, message: "Failed to save customer address." };
  }
}

export async function getCustomerAddressesApi(customerId: string, forceRefresh?: boolean) {
  const cacheKey = `getCustomerAddressesApi:${customerId}`;
  if (!forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const res = await fetch(`${API_BASE_URL}/customer-address/${customerId}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCustomerAddressesApi error:", error);
    return { success: false, message: "Failed to fetch customer addresses." };
  }
}

export async function updateCustomerAddressApi(id: string, payload: Partial<ApiCustomerAddressPayload>) {
  clearApiCache("getCustomerAddressesApi");
  try {
    const res = await fetch(`${API_BASE_URL}/customer-address/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateCustomerAddressApi error:", error);
    return { success: false, message: "Failed to update customer address." };
  }
}

export async function deleteCustomerAddressApi(id: string) {
  clearApiCache("getCustomerAddressesApi");
  try {
    const res = await fetch(`${API_BASE_URL}/customer-address/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteCustomerAddressApi error:", error);
    return { success: false, message: "Failed to delete customer address." };
  }
}

// ─── PARTNER APIS ───

export interface ApiPartner {
  _id: string;
  partnerId: string;
  name: string;
  mobile: string;
  rating?: number;
  category?: string;
  locality?: string;
  totalJobs?: number;
  lastCompletedJob?: {
    title: string;
    bookingId?: string;
    completedAt?: string;
  };
}

export async function getPartnerDropdownApi(forceRefresh?: boolean) {
  const cacheKey = `getPartnerDropdownApi`;
  if (!forceRefresh && apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }
  try {
    const res = await fetch(`${API_BASE_URL}/partner/dropdown`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getPartnerDropdownApi error:", error);
    return { success: false, message: "Failed to fetch partner dropdown." };
  }
}

export async function assignPartnerToBookingApi(bookingId: string, partnerId: string) {
  clearApiCache("getBookingsApi");
  try {
    const res = await fetch(`${API_BASE_URL}/booking/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId }),
    });
    return await res.json();
  } catch (error) {
    console.error("assignPartnerToBookingApi error:", error);
    return { success: false, message: "Failed to assign partner to booking." };
  }
}

// ─── TRENDING WEBSITE SECTION APIS ───

export interface ApiTrendingPackage {
  _id: string;
  packageId: {
    _id: string;
    serviceActionId?: string;
    packageName: string;
    subtitle?: string;
    description?: string;
    price: number;
    originalPrice: number;
    duration?: number;
    imageUrl?: string;
    thumbnailUrl?: string;
  } | string;
  displayOrder: number;
  status: boolean;
}

export interface ApiTrendingCatalogItem {
  packageId: string;
  packageName: string;
  category: {
    id: string;
    name: string;
  };
  serviceAction: {
    id: string;
    name: string;
  };
  price: number;
  originalPrice: number;
  discountPercentage: number;
  duration: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

export async function getAdminTrendingPackagesApi(forceRefresh?: boolean) {
  const cacheKey = `getAdminTrendingPackagesApi`;
  const cached = getFromCache(cacheKey, forceRefresh);
  if (cached) return cached;

  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/trending`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getAdminTrendingPackagesApi error:", error);
    return { success: false, message: "Failed to fetch admin trending packages." };
  }
}

export async function getTrendingCatalogPackagesApi(params?: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const queryString = query.toString() ? `?${query.toString()}` : "";
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/trending/catalog${queryString}`);
    return await res.json();
  } catch (error) {
    console.error("getTrendingCatalogPackagesApi error:", error);
    return { success: false, message: "Failed to fetch trending catalog packages." };
  }
}

export async function addTrendingPackageApi(packageId: string) {
  clearApiCache("getAdminTrendingPackagesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/trending`, {
      method: "POST",
      body: JSON.stringify({ packageId }),
    });
    return await res.json();
  } catch (error) {
    console.error("addTrendingPackageApi error:", error);
    return { success: false, message: "Failed to add package to trending." };
  }
}

export async function removeTrendingPackageApi(packageId: string) {
  clearApiCache("getAdminTrendingPackagesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/trending/${packageId}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("removeTrendingPackageApi error:", error);
    return { success: false, message: "Failed to remove package from trending." };
  }
}

// ─── CITY MANAGEMENT APIS ───

export interface ApiCity {
  _id: string;
  cityName: string;
  stateName: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getCitiesApi(params?: { status?: boolean; search?: string; forceRefresh?: boolean }) {
  const query = new URLSearchParams();
  if (params?.status !== undefined) query.append("status", String(params.status));
  if (params?.search) query.append("search", params.search);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const cacheKey = `getCitiesApi:${queryString}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;

  try {
    const res = await authFetch(`${API_BASE_URL}/admin/cities${queryString}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getCitiesApi error:", error);
    return { success: false, message: "Failed to fetch cities." };
  }
}

export async function getCityDetailsApi(id: string) {
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/cities/${id}`);
    return await res.json();
  } catch (error) {
    console.error("getCityDetailsApi error:", error);
    return { success: false, message: "Failed to fetch city details." };
  }
}

export async function addCityApi(payload: { cityName: string; stateName: string; status?: boolean }) {
  clearApiCache("getCitiesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/cities`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("addCityApi error:", error);
    return { success: false, message: "Failed to add city." };
  }
}

export async function updateCityApi(id: string, payload: { cityName?: string; stateName?: string; status?: boolean }) {
  clearApiCache("getCitiesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/cities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("updateCityApi error:", error);
    return { success: false, message: "Failed to update city." };
  }
}

export async function deleteCityApi(id: string) {
  clearApiCache("getCitiesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/cities/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteCityApi error:", error);
    return { success: false, message: "Failed to delete city." };
  }
}

// ─── WEBSITE ZONES MANAGEMENT APIS ───

export interface ApiWebsiteZone {
  _id: string;
  zoneName: string;
  city: string;
  proCount?: number;
  sortOrder?: number;
  areasCovered?: string[];
  status?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getWebsiteZonesApi(params?: { search?: string; city?: string; status?: string; forceRefresh?: boolean }) {
  const cacheKey = `getWebsiteZonesApi:${JSON.stringify(params || {})}`;
  const cached = getFromCache(cacheKey, params?.forceRefresh);
  if (cached) return cached;

  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.city) query.append("city", params.city);
  if (params?.status) query.append("status", params.status);

  const queryString = query.toString() ? `?${query.toString()}` : "";

  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/zones${queryString}`);
    const data = await res.json();
    if (data && data.success !== false) {
      apiCache.set(cacheKey, data);
    }
    return data;
  } catch (error) {
    console.error("getWebsiteZonesApi error:", error);
    return { success: false, message: "Failed to fetch website zones." };
  }
}

export async function addWebsiteZoneApi(formData: FormData) {
  clearApiCache("getWebsiteZonesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/zones`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("addWebsiteZoneApi error:", error);
    return { success: false, message: "Failed to add website zone." };
  }
}

export async function updateWebsiteZoneApi(id: string, formData: FormData) {
  clearApiCache("getWebsiteZonesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/zones/${id}`, {
      method: "PATCH",
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("updateWebsiteZoneApi error:", error);
    return { success: false, message: "Failed to update website zone." };
  }
}

export async function deleteWebsiteZoneApi(id: string) {
  clearApiCache("getWebsiteZonesApi");
  try {
    const res = await authFetch(`${API_BASE_URL}/admin/website/zones/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("deleteWebsiteZoneApi error:", error);
    return { success: false, message: "Failed to delete website zone." };
  }
}


