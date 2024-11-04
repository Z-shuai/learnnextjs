export default async function Page() {
  const data = await fetch("http://127.0.0.1:5500/mock-data.json");
  console.log(data);
  const posts = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
