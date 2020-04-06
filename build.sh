cd frontend
parcel build --public-url ./ index.html
rm release/*
cp dist/* release
