!#/bin/sh

cd client
# npm i
npm run build

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

# echo "web: node server.js" > Procfile
# git checkout heroku
# cp -R dist/* .
# rm -rf dist
# git add .
# git commit -m 'deploy'
# git push
# git checkout -



