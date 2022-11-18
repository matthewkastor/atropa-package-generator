cmd /c npm install
pause
rem cmd /c npm run-script srcFormat
cmd /c npm run-script lint
pause
cmd /c npm run-script buildDocs
pause