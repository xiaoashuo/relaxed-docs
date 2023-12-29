@echo off

:: Ensure script stops on encountering errors
set REPO_URL=git@github.com:xiaoashuo/relaxed-docs.git
set BRANCH_NAME=master
set REMOTE_BRANCH_NAME=gh_pages
:: Generate static files
call yarn docs:build

:: Enter the generated folder
cd docs\.vuepress\dist
:: dir
:: If deploying to a custom domain
:: echo 'www.example.com' > CNAME

:: Initialize a new Git repository
call  git init

call  git add -A
call  git commit -m "deploy"


:: If deploying to https://<USERNAME>.github.io
:: git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

:: If deploying to https://<USERNAME>.github.io/<REPO>
:: call  git push -f git@github.com:xiaoashuo/relaxed-docs.git master:gh_pages
call git push -f %REPO_URL% %BRANCH_NAME%:%REMOTE_BRANCH_NAME%

:: 检查上一个命令的退出代码
if %errorlevel% neq 0 (
  echo 错误：推送到GitHub失败。
  exit /b %errorlevel%
)
:: Return to the original directory
cd ..
echo 访问地址: https://xiaoashuo.github.io/relaxed-docs/
pause()


