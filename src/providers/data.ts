import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }


      filters?.forEach((filter) => {
        if (!("field" in filter)) return;

        const { field } = filter;
        if (filter.value === undefined || filter.value === null) return;

        const value = String(filter.value);

        // Property and relationship filters
        if (
            ["properties", "units", "floors", "blocks"].includes(resource) &&
            ["propertyId", "blockId", "floorId", "unitTypeId", "status"].includes(field)
        ) {
          params[field] = value;
        }

        if (field === "role") {
          params.role = value;
        }

        if (resource === "properties" && field === "name") {
          params.search = value;
        }

        if (resource === "users") {
          if (["search", "name", "email"].includes(field)) {
            params.search = value;
          }
        }

        if (["leases", "tenants", "units", "floors", "blocks", "invoices"].includes(resource)) {
          if (field === "name") {
            params.search = value;
          }
        }
      });


      return params;
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options,
    {
      fetch: (url, init) =>
          fetch(url, {
            ...init,
            credentials: "include"
          })
    }
);

export { dataProvider };