interface PostCardProps {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export function PostCard({ id, userId, title, body }: PostCardProps) {
  return (
    <div className="post-card">
      <span>#{id} · Autor ID: {userId}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}