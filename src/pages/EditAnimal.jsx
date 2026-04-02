import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import './FormAnimal.css'
import { IoIosArrowBack } from "react-icons/io";
import { FiSave } from "react-icons/fi";

function EditAnimal({ user }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    nome: '',
    idade: '',
    especie: 'Cão',
    raca: '',
    porte: 'Médio',
    cidade: '',
    descricao: '',
    foto_url: '',
    status: 'disponivel',
  })

  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregarAnimal() {
      const { data, error } = await supabase
        .from('animals')
        .select(`
            id,
            nome,
            idade,
            especie,
            raca,
            porte,
            cidade,
            descricao,
            foto_url,
            status,
            created_at
          `)
        .eq('id', id)
        .single()

      if (error || !data) {
        setErro('Animal não encontrado.')
        setCarregando(false)
        return
      }

      if (data.user_id !== user.id) {
        setErro('Você não tem permissão para editar este animal.')
        setCarregando(false)
        return
      }

      setForm({
        nome: data.nome || '',
        idade: data.idade || '',
        especie: data.especie || 'Cão',
        raca: data.raca || '',
        porte: data.porte || 'Médio',
        cidade: data.cidade || '',
        descricao: data.descricao || '',
        foto_url: data.foto_url || '',
        status: data.status || 'disponivel',
      })

      setPreview(data.foto_url || '')
      setCarregando(false)
    }

    carregarAnimal()
  }, [id, user.id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleFotoChange(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return

    if (!arquivo.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem válido.')
      return
    }

    setErro('')
    setFoto(arquivo)
    setPreview(URL.createObjectURL(arquivo))
  }

  async function uploadImagem() {
    if (!foto) return form.foto_url

    const extensao = foto.name.split('.').pop()
    const nomeArquivo = `${user.id}-${Date.now()}.${extensao}`
    const caminhoArquivo = `fotos/${nomeArquivo}`

    const { error: uploadError } = await supabase.storage
      .from('animais')
      .upload(caminhoArquivo, foto, {
        cacheControl: '3600',
        upsert: false,
        contentType: foto.type,
      })

    if (uploadError) {
      throw new Error('Erro ao enviar a nova imagem.')
    }

    const { data } = supabase.storage
      .from('animais')
      .getPublicUrl(caminhoArquivo)

    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!form.nome || !form.cidade) {
      setErro('Preencha ao menos o nome e a cidade.')
      return
    }

    setSalvando(true)

    try {
      const foto_url = await uploadImagem()

      const { error } = await supabase
        .from('animals')
        .update({
          ...form,
          foto_url,
          idade: Number(form.idade) || 0,
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw new Error('Erro ao salvar. Tente novamente.')
      }

      setSucesso('Animal atualizado com sucesso!')
      setTimeout(() => navigate('/painel'), 1500)
    } catch (err) {
      setErro(err.message || 'Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="loading-container" style={{ height: 'calc(100vh - 66px)' }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="form-animal-card">
          <div className="form-animal-header">
            <h1>Editar animal</h1>
            <p>Atualize as informações do animal abaixo.</p>
          </div>

          {erro && <div className="msg-erro">{erro}</div>}
          {sucesso && <div className="msg-sucesso">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Nome do animal *</label>
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Espécie *</label>
                <select name="especie" value={form.especie} onChange={handleChange}>
                  <option>Cão</option>
                  <option>Gato</option>
                  <option>Pássaro</option>
                  <option>Coelho</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Raça</label>
                <input
                  name="raca"
                  value={form.raca}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Idade (em anos)</label>
                <input
                  name="idade"
                  type="number"
                  min="0"
                  max="30"
                  value={form.idade}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Porte</label>
                <select name="porte" value={form.porte} onChange={handleChange}>
                  <option>Pequeno</option>
                  <option>Médio</option>
                  <option>Grande</option>
                </select>
              </div>

              <div className="input-group">
                <label>Cidade *</label>
                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="disponivel">Disponível para adoção</option>
                <option value="em_processo">Em processo de adoção</option>
                <option value="adotado">Já foi adotado</option>
              </select>
            </div>

            <div className="input-group">
              <label>Foto do animal</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
              />
            </div>

            {preview && (
              <div className="input-group">
                <label>Pré-visualização</label>
                <img
                  src={preview}
                  alt="Pré-visualização do animal"
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}

            <div className="input-group">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="form-botoes">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/painel')}
              >
                <IoIosArrowBack /> Voltar
              </button>

              <button type="submit" className="btn-primary" disabled={salvando}>
                <FiSave /> {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditAnimal