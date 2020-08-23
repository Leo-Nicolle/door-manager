!#/bin/sh

git checkout heroku
cd client
# npm i
# npm run build

cd ../server
# npm i
npm run build

cd ../
rm -rf dist
mkdir dist
mkdir dist/db
mkdir dist/public

cp -R server/dist/* dist 
cp -R server/db dist/db*
cp -R client/dist/* dist/public

echo "web: node dist/server.js" > Procfile
git add dist
git add Procfile

git commit -m 'deploy'
git push
git checkout -



