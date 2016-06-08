for %%i in ("%~dp0..") do set "folder=%%~fi"

pushd %folder%
node server