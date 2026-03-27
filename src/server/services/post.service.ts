type Post = {
    id: number
    title: string
    content: string
}

let posts: Post[] = []
let idCounter = 1

export const postService = {
    create(data: { title: string; content: string }) {
        const newPost = {
            id: idCounter++,
            ...data,
        }

        posts.push(newPost)
        return newPost
    },

    getAll() {
        return posts
    },

    getById(id: number) {
        return posts.find((p) => p.id === id)
    },

    update(id: number, data: Partial<Omit<Post, 'id'>>) {
        const post = posts.find((p) => p.id === id)
        if (!post) throw new Error('Post not found')

        Object.assign(post, data)
        return post
    },

    delete(id: number) {
        posts = posts.filter((p) => p.id !== id)
        return { success: true }
    },
}