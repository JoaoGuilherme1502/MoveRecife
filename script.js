const API_URL = 'https://blog-api.seedabit.org.br/api/posts'; 
        const API_KEY = 'group-3-trjgjsqs';

       
        const getHeaders = () => {
            return {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY 
            };
        };

       
        async function fetchPosts() {
            const container = document.getElementById('postsList');
            container.innerHTML = '<p>Carregando relatos...</p>'; 

            try {
                
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: getHeaders()
                });

                if (!response.ok) throw new Error('Falha ao buscar dados');
                
                const posts = await response.json();
                container.innerHTML = ''; 

                if (posts.length === 0) {
                    container.innerHTML = '<p>Nenhum relato encontrado.</p>';
                    return;
                }

               
                posts.reverse().forEach(post => {
                    const card = document.createElement('div');
                    card.className = 'post-card';
                    
                    const title = post.title || 'Sem título';
                    const content = post.content || 'Sem conteúdo';
                    const author = post.author || 'Anônimo';
                    const id = post.id; 

                    card.innerHTML = `
                        <div>
                            <h4>${title}</h4>
                            <p>${content}</p>
                            <div class="post-author">Enviado por: ${author}</div>
                        </div>
                        <button onclick="deletePost('${id}')" class="btn-delete">Excluir</button>
                    `;
                    container.appendChild(card);
                });
            } catch (error) {
                console.error(error);
                container.innerHTML = '<p style="color: #ff6b6b">Erro ao carregar os posts.</p>';
            }
        }

       
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            const author = document.getElementById('author').value;
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;

          
            const newPost = { 
                title: title, 
                content: content,
                author: author
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: getHeaders(), 
                    body: JSON.stringify(newPost)
                });

                if (response.ok) {
                    alert('Relato enviado com sucesso!');
                    document.getElementById('postForm').reset();
                    fetchPosts(); 
                } else {
                    const errorData = await response.json();
                    alert('Erro: ' + (errorData.message || 'Erro ao enviar.'));
                }
            } catch (error) {
                console.error(error);
                alert('Erro de conexão.');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });

        
        async function deletePost(id) {
            if (!confirm('Tem certeza que deseja apagar este relato?')) return;

            try {
             
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: getHeaders()
                });

                if (response.ok) {
                   
                    fetchPosts(); 
                } else {
                    alert('Erro ao excluir. Talvez você não tenha permissão para apagar este post específico.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao tentar excluir.');
            }
        }

        
        document.addEventListener('DOMContentLoaded', fetchPosts);