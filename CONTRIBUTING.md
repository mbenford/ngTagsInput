# Contributing to ngTagsInput

So you want to contribute to ngTagsInput... that's awesome! I really appreciate the help in making this project better. Here you will find everything you need to know in order to implement your contribution and send it as a pull request.

## Setting up your environment

Before writing your killing feature you need to have a few things set up:

1. Install Node.js (0.10.22 or higher)
2. Install `grunt-cli` and `karma-cli` globally

        npm install -g grunt-cli karma-cli

3. Install Ruby and the `sass` gem if you want to compile the SCSS files
4. Clone your repository

        git clone https://github.com/<your_github_username>/ngTagsInput
        
5. Go to the ngTagsInput directory

        cd ngTagsInput
        
6. Add the main ngTagsInput repo as an upstream remote

        git remote add upstream https://github.com/mbenford/ngTagsInput

7. Install the development dependencies

        npm install
        
That's it.

## Building from the source code

You can build ngTagsInput with a single command:

    grunt pack
    
That performs all tasks needed to produce the final JavaScript and CSS files. After the build completes, a folder named `build` will be generated containing the following files:

    ng-tags-input.js
    ng-tags-input.css
    ng-tags-input.min.js
    ng-tags-input.min.css

In addition to `pack` there are other useful tasks you might want to use:

- `pack:js`: Generates only the Javascript files.
- `test`: Runs all tests using PhantomJS (you can use `karma start` as well, of course).
- `watch`: Runs all tests automatically every time the source code files change.
- `coverage`: Generates the code coverage report. This may help you be sure nothing is left untested.

# Guidelines

Even though ngTagsInput isn't a big project, there are a few guidelines I'd like you to follow so everything remains organized and consistent.

## Coding guidelines

No endless list of conventions and standards here; just three simple guidelines:

- All code must follow the rules defined in the [.jshintrc](/jshintrc) file (Grunt gets you covered here. Just run `grunt jshint`).
- All features or bug fixes must be covered by one or more tests.
- All public API changes (e.g. new options for directives) must be documented with ngdoc-like tags.

## Commit message guidelines*

<small>\* Heavily inspired on AngularJS commit guidelines</small>

Good, neat commit messages are very important to keep the project history organized. In addition to that, each release changelog is generated out of the commits messages, so they should be readable and concise.

### Message Format

Each commit consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>
    
The subject line has a soft limit of 50 characters, and all remaining lines have a soft limit of 75 characters.

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug or adds a feature
- **test**: Adding missing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope

The scope could be anything specifying the place of the commit change. For example `tagsInput`, `autocomplete`, `release`, `build`, etc...

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes" The body should include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer should contain any information about Breaking Changes and it's also the place to reference GitHub issues that this commit Closes.

#### Example

    feat(tagsInput): Add addOnBlur option

    Add an option for the user to set if a tag should be created when the
    input field loses focus and there is some text left in it. This feature
    is important because it prevents a tag from being accidentally lost when
    it's not explicitly added.

    Closes #29.

## Pull Request guidelines

Before submitting your pull request, consider the following:

- Make your changes in a new branch (this will help you rebase your code if/when needed)

        git checkout -b my-feature-branch
              
- Make sure all tests pass

        grunt test
        
- Use the `test/test-page.html` file to test your changes in the browser, if you want to
- Commit your changes by following the commit guidelines

You may want to rebase your branch on top of the latest version of the master branch. To do so is simple:

1. Switch to `master` branch

        git checkout master      

2. Pull the latest changes from the server

        git pull upstream master
        
3. Switch back to your feature branch

        git checkout my-feature-branch
        
4. Rebase it on top of the master branch (there might be conflicts you'll need to resolve)

        git rebase master -i
        
5. Push the changes into your remote repository

        git push
        
6. In GitHub, send a pull request to `ngTagsInput:master`

That's it! Thank you for contributing!

In case you need to do changes after creating a pull request, repeat steps 1 though 4 and force a push into your remote repository

    git push --force
    
That will update your pull request. You might want to update the PR page explaining the changes you have done.