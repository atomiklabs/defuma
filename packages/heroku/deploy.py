import os
import shutil
import sys

ROOT_PATH = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
PACKAGES_PATH = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
FILE_PATH = os.path.dirname(os.path.realpath(__file__))

# web-ui
WEB_UI_PATH = os.path.join(PACKAGES_PATH, 'web-ui')
WEB_UI_PATH_HEROKU = os.path.join(FILE_PATH, 'web-ui')
# auth server
# AUTH_PATH = os.path.join(PACKAGES_PATH, 'auth/server')
# AUTH_PATH_HEROKU = os.path.join(FILE_PATH, 'auth/server')

def clear():
    if os.path.exists(WEB_UI_PATH_HEROKU):
      shutil.rmtree(WEB_UI_PATH_HEROKU)
    # if os.path.exists(AUTH_PATH_HEROKU):
    #   shutil.rmtree(AUTH_PATH_HEROKU)

def build_web_ui():
    os.system('cd {} && yarn build && yarn server:build'.format(WEB_UI_PATH))

def copy_web_ui():
    shutil.copytree(
        os.path.join(WEB_UI_PATH),
        WEB_UI_PATH_HEROKU,
        ignore=shutil.ignore_patterns('node_modules', 'src', 'server', 'public', 'package.json', '.env', '.eslintrc.js', '.gitignore', 'README.md', 'tsconfig.json', 'yarn.lock'))

# def copy_web_ui():
#     shutil.copytree(
#         os.path.join(WEB_UI_PATH),
#         WEB_UI_PATH_HEROKU,
#         ignore=shutil.ignore_patterns('node_modules', 'src', 'public', 'package.json', '.env', '.eslintrc.js', '.gitignore', 'README.md', 'tsconfig.json', 'yarn.lock'))

# def build_auth():
#     os.system('cd {} && yarn build'.format(AUTH_PATH))

# def copy_auth():
#     shutil.copytree(
#         os.path.join(AUTH_PATH),
#         AUTH_PATH_HEROKU,
#         ignore=shutil.ignore_patterns('node_modules', 'src', 'public', 'package.json', '.env', '.eslintrc.js', '.gitignore', 'README.md', 'tsconfig.json','yarn.lock'))

# def copy_auth():
#     shutil.copytree(
#         os.path.join(AUTH_PATH),
#         AUTH_PATH_HEROKU,
#         ignore=shutil.ignore_patterns('node_modules', 'dist', '.env', ', .gitignore', 'README.md'))

def push_to_heroku():
    os.system('git checkout heroku-deploy')
    os.system('git add .')
    os.system('git commit -m "deploy: Deploy to Heroku"')
    os.system('cd {} && git push heroku `git subtree split --prefix packages/heroku heroku-deploy`:master --force'.format(ROOT_PATH))
    # os.system('git checkout master')

def main():
    clear()
    build_web_ui()
    copy_web_ui()
    # build_auth()
    # copy_auth()
    push_to_heroku()

if __name__ == "__main__":
    main()



