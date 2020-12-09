function duplicate(arr) {
    const temp = arr.slice()

    for (let i = 0; i < arr.length; i++) {
        temp.push(arr[i])
    }
    return temp
}

const main = () => {
    duplicate([])
}

main()
