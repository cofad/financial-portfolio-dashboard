## Typescript

- All code must be typed
- Do NOT use `any`
- Use `unknown` only if absolutely required

## Imports

- Utilize the path aliases listed in the tsconfig
- Don't use the general `@/` if there's a more specific alias

## Styling

- Use tailwind CSS for all styling

## Components

- No 3rd party UI libraries can be used
- Prefer small, composable components
- Keep components to less than 200 lines in length
- Create a directory for each component and its sub-components and tests

## HTTP Request

- Use axios for all HTTP requests
- Use react query in components for accessing asynchronous data

## State Management

- Use redux persist for storing data in localStorage
- Use redux toolkit for global state management
