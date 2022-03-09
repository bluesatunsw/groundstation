"use strict";
getPosition().then((position) => {
    console.log(position);
}).catch((err) => {
    console.error(err);
});
