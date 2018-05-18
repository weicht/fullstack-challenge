# Griffin Group Global full stack Development Challenge

Hi! Thank you for your interest in [Griffin Group Global][g3website]. Our evaluation processes begins with an open-ended coding challenge that we will discuss during your interview. There is not one correct way to approach this challenge. Rather, we would like to see your approach and your creativity in solving the problem.

We appreciate that any coding challenge represents an investment of your time. We hope you see the value in having a code sample that is relatable to both of us for the interview. Should you be unsuccessful, you should feel free to use the code you developed for this challenge in any way that you would like.

If you are successful, then we will set up an in-person interview and use this code as the starting point in our conversation.

# The Challenge
Griffin Group Global employs several technologies to create a microservice based architecture. We are currently using
[Nodejs][nodejs] on the backend in our [docker][docker] based microservices. Our UX currently targets the IOS platform
but as we expand we will move to android based UXs and responsive web applications. 

Our challenge is to create a web based UI that allows a web UI user to communicate with a non web UI user. The web ui should
allow the web user to Create and Read individual contacts where the contact name and method of communication are stored.
The web UI should allow the web user to communicate with a contact using conversations where a conversation is a
communication chain centered around a subject. The contact should be able to respond on the communication chain and that
message should appear in the correct conversation.

## Minimum Challenge Requirements
We would like a minimum  capability. These are:
- A RESTful create and read mechanism for contacts
- A RESTful create and read mechanism for conversations.
- Contacts and Conversation shall be their own independent services (microservice).
- a Web UI that allows a user to send messages in a conversation to contact, using the contacts preferred communication 
method.

The basic format for the RESTful route would conform to:

`[VERB] [base]/[type]/[id]{?param1=value1{...&paramn=valuen}}`

where:
- `VERB` represents the HTTP verb (GET, POST, etc.)
- `[]` denotes required information
- `base` denotes the base URL, such as [http://localhost:8080](http://localhost:8080)
- `type` denotes the microservice resource name, such as "Organization"
- `id` denotes the object ID to look up
- `{}` denotes optional values
- `param` denotes the name in the datamodel to query against
- `value` denotes the value to query for
- `…` denotes that there can be any number of query parameters

The communication method that is used to communicate with the contact is of your choosing. We would suggest using email
and setting headers to align the communication with conversations, but that is up to you.

## Where to concentrate your effort
In a microservices application, there are many areas that need to be developed. While implementing the minimum requirements, please feel to implement one or more items in these areas. Please do not feel limited to these areas if you would like to add your take on microservice development.

- Error handling
  - Which HTTP Codes should be returned and under which circumstances?
  - Should the user of the API get more information than an HTTP status code?
  - Do integration tests reflect these error conditions?
  - etc.
- Debug statements
- [TDD]
- Service security
- HTTP header security
- Encrypted communications
- Caching
- Microservice health checks
- Database communications security
- Code quality, such as unit test coverage
- Style, such as using [ESLint][eslint] and specific rules, such as [Airbnb][airbnb-eslint]
- Visually appealing UX

Please do not overthink think this or get too wrapped up in making a bullet proof application. This is a  
comprehensive full stack challenge just building the minimum requirements, so spending a lot of time ensuring production
level robustness is not required. Rather, we like to see your architectural choices and approach to coding over 
production ready, visually appealing features.

# Prerequisites
- A basic understanding of source code control, [git][git-scm] is required.
- You must make your code available via a [GitHub][github] account.
- You should be familiar with creating data APIs.

# Getting Started
1. Fork this [repository][repository].
1. Clone the fork to your personal machine.
1. Start coding.
1. Commit changes to your fork as you see fit.

# Submission

When you are comfortable with your results, please email your fork to
[g3-dev@griffingroupglobal.com](mailto:g3-dev@griffingroupglobal.com). Please keep your emails short and to the point.

Any specific notes or further information you would like to add about your submittal, should be included in the GitHub project.

Do not feel as though you must create a public fork of this repository. You are free to create a throwaway GitHub account or private fork. In those cases, please let us know so that we may send you the GitHub IDs to add to the repository.

# Evaluations

We realize there are many items to look at when creating an application. Please do not feel like like you have to do everything. Please do not feel like you must use the technologies on our stack. Use your strengths to your advantage in the code you write. Give us a heads up by documenting your code to let us know where and why you concentrated on certain
items.

As you develop your solution, you may have ideas on other avenues to pursue. Please feel free to include them inline as documented source or as additional [Common Mark][commonmark] compliant notes in your fork.

We look for creativity, originality, and a good user experience in your application if that's an area you focused on.

We look for readability, good architectural decisions, modularity, and a solid approach to testing in your code.

# License
This project is [MIT licensed][mitlicense].

[g3website]:https://www.griffingroupglobal.com
[git-scm]:https://git-scm.com/
[github]:https://github.com/
[nodejs]:https://nodejs.org/en/
[TDD]:https://en.wikipedia.org/wiki/Test-driven_development
[ES6]:http://www.ecma-international.org/ecma-262/6.0/
[eslint]:https://eslint.org/
[airbnb-eslint]:https://www.npmjs.com/package/eslint-config-airbnb
[mocha]:https://mochajs.org/
[repository]:https://github.com/GriffinGroupGlobal/fullstack-challenge
[mitlicense]:https://en.wikipedia.org/wiki/MIT_License
[commonmark]:https://spec.commonmark.org/]
[docker]:https://www.docker.com/