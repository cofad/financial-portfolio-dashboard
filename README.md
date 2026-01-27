# Financial Portfolio Dashboard

This application is a website that provides mock stock data and allows the user to build a mock portfolio and
monitor its current state as well as historical performance. The asset data is stored locally in the user's browser
using local storage and is never stored on a server. Asset quote and historical data is retrieved from a custom API
that provides mock financial data.

The app is currently hosted by GitHub pages and accessible on my personal site at
<https://financial-portfolio-dashboard.will-warner.dev/>

## Setup

### Prerequisites

- Node.js v24.11.1 (see .nvmrc)
  - It is highly recommended to use [nvm (Node Version Manager)](https://www.nvmnode.com/) to help manage Node.js
    installations

### Environment Variables

In its current configuration, no environment variables are needed to run the app.

### Installation

To install and run the app ensure the proper version of Node.js (see .nvmrc) is installed. Once Node.js is
installed, run `npm ci` to install the required dependencies.

```bash
nvm install # optional if you use nvm to manage Node.js
nvm use     # optional if you use nvm to manage Node.js
npm ci
```

### Run the App

Once the node_modules are installed the app can be run with a simple `npm run dev` command. This will start a dev
server on port 5173 and the application can be opened in the browser at <http://localhost:5173/>.

```bash
npm run dev
```

### Quality Gates

There are several tools used as quality gates:

- Prettier for formatting
- ESLint for linting
- Vitest for tests
- TypeScript for type checking

These tools can be run via the following npm scripts:

```bash
npm run format         # Runs the formatter and applies the changes
npm run format:check   # Runs the formatter and returns the incorrect files
npm run lint
npm run lint:fix       # Runs the linter and fixes the items that can be auto-fixed
npm run test
npm run test:coverage  # To generate the coverage report
npm run test:update    # To generate new snapshots
npm run typecheck
```

### Build

To build the app simply run the following:

```bash
npm run build
```

The app is currently using GitHub Actions for CI/CD and there are action and workflow files provided in the repo
that document the specific build and deploy steps.

## Architecture

### Data Sources

Initially several sites were investigated as possible data sources for this project including the following:

- [Massive](https://massive.com/)
- [Alpha Vantage](https://www.alphavantage.co/)
- [Finnhub](https://finnhub.io/)

However, there were several issues that prevented any of these from being viable data sources including the
following:

- CORS Restrictions
  - Initially bypassed with a reverse proxy but required a server
- API Rate limits
  - Very low rate limits in the free tier
  - Not all needed data is provided in the free tier
  - There was no reasonable way to get the front-end to function properly given the extremely low rates
- Terms of Service restrictions
  - The agreement prevents the user from doing much other than directly hitting their API for private, personal use
    under the free tiers

Given these issues, I decided to create a back-end that serves fake data in a similar format to these APIs. The
data is randomly generated and meant to mimic stock names and pricing changes. It is not 100% realistic but
provides reasonable data for the purposes of this app. The back-end is a simple server written in JavaScript and is
hosted on fly.io and can be accessed at the following endpoints:

- Search - https://financial-portfolio-dashboard-server.fly.dev/search?q=BCUH
- Quote - https://financial-portfolio-dashboard-server.fly.dev/quote?name=BCUH
- History - https://financial-portfolio-dashboard-server.fly.dev/history?name=BCUH

The code for the back-end is also hosted on GitHub at
https://github.com/cofad/financial-portfolio-dashboard-server.

**Note** The back-end was not a priority on this project and the code is very simplistic and minimal. It simply is
used to provide some mock data for the front-end to consume.

### Data Persistence and Caching

The asset data is stored directly on the client in local storage using Redux Toolkit with Redux Persist. It is
loaded into memory on application startup.

Data from the server is loaded fresh each session via `useQuery`. The history data is cached for 30 minutes since
it is stable. The quote data is dynamic and is continuously refreshed every 60 seconds using the `refetchInterval`.

### Codebase Structure

The code base contains several folders that contain the components, services, and utilities for the app. There is a
"features" directory which represents sections of major functionality on the site. The remainder of the code serves
to drive functionality for those features. Where possible functionality was broken down into modular, re-usable
chunks that can be isolated. For components, those items are either co-located with the feature if specific to the
feature or in the "components" directory if they can be used at a global level.

The directories are typically flat to co-locate related modules together. This organization eases the process of
discoverability by making things easy to see in the file explorer and helping to indicate how things are related.

## UI

The app UI is structured as a single page with tabs to the different portions of functionality. This provides an
easy to use interface where users can quickly assess what screens are available and can quickly navigate there.

## CI/CD

GitHub was chosen as the Git host due to it's economic feasibility as well near universal familiarity amongst
developers. In addition to Git hosting, GitHub also provides CI/CD through the GitHub actions functionality. This
repository contains GitHub actions and workflows that define the CI/CD process. GitHub also provides hosting in the
form of GitHub pages with a custom domain provided from my personal site. The GitHub actions pipeline is configured
to run the formatting check, linting, and typechecking before building to ensure all quality gates are met. Once
the quality gates and build pass, the app is deployed automatically to GitHub pages. The workflow is triggered on
pushes to main.

## AI Usage

AI was heavily used in the development of this site. The two primary tools utilized were Gemini via the browser for
generic questions and code snippets and ChatGPT Codex via a VS Code extension for code generation. Unfortunately it
is not practical to export logs of all the requests made to these tools; however, there is no part of the
application that was developed without their usage.

## Known Limitations

- Data sources
  - The existing data sources leave something to be desired. It would be ideal if real data with sufficient rate
    limits was available that could be used to provide a more realistic experience.
- Performance history length
  - Only mocked data for a few months and did not include a full year of performance analysis

## Future Improvements

Given the opportunity, there are several items that could be investigated further and refined:

- Store tab state so page reloads will keep the same tab open
- Improve the asset form auto-complete to smooth off rough edges. Utilizing a library would help provide a nicer
  experience.
- Improve test coverage. Currently most modules have a test file associated with them which is helpful to ensure
  the module is being exercised to some degree; however, further review could identify more specific items to test.
