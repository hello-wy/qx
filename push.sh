time=`date "+%Y-%m-%d"`
git add .
git commit -m "auto push @ $1"
git pull
git push
echo "Finished Push"
