const container = document.getElementById("emojiContainer")
const search = document.getElementById("search")
const categoriesDiv = document.getElementById("categories")

let EMOJIS = []
let currentCategory = "All"
let filtered = []

// IMPORTANT: make sure path is correct relative to emoji.html
fetch("./emoji-clean.json")
.then(res => {
    if(!res.ok){
        throw new Error("Failed to load JSON")
    }
    return res.json()
})
.then(data => {
    console.log("Loaded emojis:", data.length)
    EMOJIS = data
    buildCategories()
    applyFilter()
})
.catch(err => {
    console.error("ERROR LOADING EMOJIS:", err)
    container.innerHTML = "<p>Failed to load emoji data.</p>"
})

function buildCategories(){
    const groups = [...new Set(EMOJIS.map(e => e.group))]
    groups.unshift("All")

    groups.forEach(group => {
        const btn = document.createElement("div")
        btn.className = "categoryBtn"
        btn.textContent = group

        btn.onclick = () => {
            currentCategory = group
            document.querySelectorAll(".categoryBtn")
                .forEach(b => b.classList.remove("active"))
            btn.classList.add("active")
            applyFilter()
        }

        categoriesDiv.appendChild(btn)
    })
}

// function applyFilter(){
//     const text = search.value.toLowerCase()

//     filtered = EMOJIS.filter(e => {
//         const matchCategory =
//             currentCategory === "All" || e.group === currentCategory

//         const matchSearch =
//             e.name.toLowerCase().includes(text)

//         return matchCategory && matchSearch
//     })

//     container.innerHTML = ""
//     lazyRender(0)
// }

function applyFilter() {
    const text = search.value.trim().toLowerCase()

    filtered = EMOJIS.filter(e => {
        const name = e.name.toLowerCase()
        const group = e.group.toLowerCase()

        const matchCategory =
            currentCategory === "All" ||
            e.group === currentCategory

        const matchSearch =
            text === "" ||
            name.includes(text) ||
            group.includes(text)

        return matchCategory && matchSearch
    })

    container.innerHTML = ""
    lazyRender(0)
}

function lazyRender(start){
    const chunk = 300
    const end = Math.min(start + chunk, filtered.length)

    for(let i=start; i<end; i++){
        const box = document.createElement("div")
        box.className = "emojiBox"
        box.textContent = filtered[i].char

        box.onclick = () =>
            navigator.clipboard.writeText(filtered[i].char)

        container.appendChild(box)
    }

    if(end < filtered.length){
        setTimeout(() => lazyRender(end), 0)
    }
}

search.addEventListener("input", function(){
    currentCategory = "All"

    document.querySelectorAll(".categoryBtn")
        .forEach(b => b.classList.remove("active"))

    applyFilter()
})