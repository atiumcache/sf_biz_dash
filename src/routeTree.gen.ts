/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as MainDashboardNhoodImport } from './routes/main-dashboard.$nhood'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const MainDashboardNhoodRoute = MainDashboardNhoodImport.update({
  id: '/main-dashboard/$nhood',
  path: '/main-dashboard/$nhood',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/main-dashboard/$nhood': {
      id: '/main-dashboard/$nhood'
      path: '/main-dashboard/$nhood'
      fullPath: '/main-dashboard/$nhood'
      preLoaderRoute: typeof MainDashboardNhoodImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/main-dashboard/$nhood': typeof MainDashboardNhoodRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/main-dashboard/$nhood': typeof MainDashboardNhoodRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/main-dashboard/$nhood': typeof MainDashboardNhoodRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/main-dashboard/$nhood'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/main-dashboard/$nhood'
  id: '__root__' | '/' | '/main-dashboard/$nhood'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  MainDashboardNhoodRoute: typeof MainDashboardNhoodRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  MainDashboardNhoodRoute: MainDashboardNhoodRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/main-dashboard/$nhood"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/main-dashboard/$nhood": {
      "filePath": "main-dashboard.$nhood.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
