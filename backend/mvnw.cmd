@echo off
setlocal EnableExtensions
set "MAVEN_VERSION=3.9.11"
set "MAVEN_HOME=%~dp0.mvn\apache-maven-%MAVEN_VERSION%"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
  echo Maven %MAVEN_VERSION% is not installed. Downloading the official binary distribution...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $root=Join-Path '%~dp0' '.mvn'; $zip=Join-Path $root 'apache-maven.zip'; New-Item -ItemType Directory -Force -Path $root | Out-Null; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.11/apache-maven-3.9.11-bin.zip' -OutFile $zip; Expand-Archive -Path $zip -DestinationPath $root -Force; Remove-Item $zip -Force"
  if errorlevel 1 (
    echo Failed to download Maven. Install Maven and retry.
    exit /b 1
  )
)

call "%MAVEN_HOME%\bin\mvn.cmd" %*
exit /b %errorlevel%
