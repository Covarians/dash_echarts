# dash_echarts

dash_echarts is a Dash component library to access echarts from dash.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

# How to use the module
## Cloning and installing package
After cloning the repo, at its root:

1. Install node modules:
```
$ npm install
```

2. Create a virtual environment named .venv
```
$ python -m venv .venv
```

3. Activate the virtual environment
```
$ .venv/Scripts/activate
```

4. Install required packages in the virtual environment
```
(.venv) $ pip install -r requirements.txt
```


## Updating the component's code in `src/lib/components/DashEcharts.react.js`

## Building the module
```
(.venv) $ npm run build
```

## Testing

- The demo app is in `src/demo` and you will import your example component code into your demo app.
- Test your code in a Python environment:
    1. Build your code
        ```
        $ npm run build
        ```
    2. Run and modify the `usage.py` sample dash app:
        ```
        $ python usage.py
        ```
- Write tests for your component.
    - A sample test is available in `tests/test_usage.py`, it will load `usage.py` and you can then automate interactions with selenium.
    - Run the tests with `$ pytest tests`.
    - The Dash team uses these types of integration tests extensively. Browse the Dash component code on GitHub for more examples of testing (e.g. https://github.com/plotly/dash-core-components)
- Add custom styles to your component by putting your custom CSS files into your distribution folder (`dash_echarts`).
    - Make sure that they are referenced in `MANIFEST.in` so that they get properly included when you're ready to publish your component.
    - Make sure the stylesheets are added to the `_css_dist` dict in `dash_echarts/__init__.py` so dash will serve them automatically when the component suite is requested.
- [Review your code](./review_checklist.md)


## Create a production build and publish

1. Build your code:
    ```
    $ npm run build
    ```
2. Create a Python distribution
    ```
    $ python setup.py sdist bdist_wheel
    ```
    This will create source and wheel distribution in the generated the `dist/` folder.
    See [PyPA](https://packaging.python.org/guides/distributing-packages-using-setuptools/#packaging-your-project)
    for more information.

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ pip install dash_echarts-0.0.1.tar.gz
    ```

4. If it works, then you can publish the component to NPM and PyPI:
    1. Publish on PyPI
        ```
        $ twine upload dist/*
        ```
    2. Cleanup the dist folder (optional)
        ```
        $ rm -rf dist
        ```
    3. Publish on NPM (Optional if chosen False in `publish_on_npm`)
        ```
        $ npm publish
        ```
        _Publishing your component to NPM will make the JavaScript bundles available on the unpkg CDN. By default, Dash serves the component library's CSS and JS locally, but if you choose to publish the package to NPM you can set `serve_locally` to `False` and you may see faster load times._

5. Share your component with the community! https://community.plotly.com/c/dash
    1. Publish this repository to GitHub
    2. Tag your GitHub repository with the plotly-dash tag so that it appears here: https://github.com/topics/plotly-dash
    3. Create a post in the Dash community forum: https://community.plotly.com/c/dash

<br>

# How to create this project with Cookiecutter 2.6.0
Documentation for cookiecutter use with dash component boilerplate can be found here: https://github.com/plotly/dash-component-boilerplate

Install Cookiecutter:
```
$ pip install cookiecutter
```

Run the cookiecutter, which will create the project folder:

```
$ cookiecutter gh:plotly/dash-component-boilerplate
```

Configure the cookiecutter:
```
You've downloaded C:\Users\Victor\.cookiecutters\dash-component-boilerplate before. Is it okay to delete and re-download it? [y/n] (y): 
  [1/14] project_name (my dash component): dash_echarts
  [2/14] project_shortname (dash_echarts): 
  [3/14] component_name (DashEcharts): DashECharts
  [4/14] jl_prefix (): 
  [5/14] r_prefix (): 
  [6/14] author_name (Enter your first and last name (For package.json)): Covarians
  [7/14] author_email (Enter your email (For package.json)): dirtech@covarians.eu
  [8/14] github_org (): 
  [9/14] description (Project Description): ECharts for Dash
  [10/14] Select use_async
    1 - False
    2 - True
    Choose from [1/2] (1): 2
  [11/14] Select component_type
    1 - Function Component
    2 - Class Component
    Choose from [1/2] (1): 
  [12/14] Select license
    1 - MIT License
    2 - BSD License
    3 - ISC License
    4 - Apache Software License 2.0
    5 - GNU General Public License v3
    6 - Not open source
    Choose from [1/2/3/4/5/6] (1): 6
  [13/14] publish_on_npm [y/n] (y): n
  [14/14] install_dependencies [y/n] (y): 
```

Open the created folder (dash_echarts) in VSC.

Try to install packages in the package-lock.json file:
```
$ npm install
```

Install all npm packages required by the project and not yet in the package-lock.json file:
```
$ npm install echarts echarts-gl echarts-stat mapbox-gl
```

Activate the Python virtual environment:
```
$ venv/Scripts/Activate
```

Build the module (to check that there are no errors):
```
(venv) $ npm run build
```
