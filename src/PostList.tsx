import { useState, useEffect } from 'react';
import { Loading } from './Loading';
import { PostCard } from './PostCard';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscador por título
  const [busqueda, setBusqueda] = useState('');

  // Paginación (5 posts por página)
  const [paginaActual, setPaginaActual] = useState(1);
  const [postsPorPagina] = useState(5);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Error al cargar las publicaciones');
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err) {
      setError('No se pudieron cargar las publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Filtrar por título (y también podés incluir el cuerpo si querés)
  const postsFiltrados = posts.filter((post) =>
    post.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular páginas y elementos de la página actual
  const totalPaginas = Math.max(1, Math.ceil(postsFiltrados.length / postsPorPagina));
  const indiceUltimo = paginaActual * postsPorPagina;
  const indicePrimero = indiceUltimo - postsPorPagina;
  const postsPaginados = postsFiltrados.slice(indicePrimero, indiceUltimo);

  return (
    <div className="post-list">
      <div className="controles">
        <h2>Publicaciones ({postsFiltrados.length})</h2>

        <button type="button" onClick={fetchPosts}>
          Recargar
        </button>

        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      <div className="posts-grid">
        {postsPaginados.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            userId={post.userId}
            title={post.title}
            body={post.body}
          />
        ))}
      </div>

      <div className="paginacion">
        <button
          type="button"
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
        >
          Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          type="button"
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}