import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import './FormAnimal.css'
import { FaCheck } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

function AddAnimal({ user }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    idade: '',
    especie: 'Cão',
    raca: '',
    porte: 'Médio',
    cidade: '',
    descricao: '',
    status: 'disponivel',
    nome_tutor: '',
    telefone: '',
  })

  const [foto, setFoto] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

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
  }

  async function uploadImagem() {
    if (!foto) return ''

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
      throw new Error('Erro ao enviar a imagem.')
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

    if (!form.nome || !form.cidade || !form.nome_tutor || !form.telefone) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    setCarregando(true)

    try {
      const telefoneLimpo = form.telefone.replace(/\D/g, '')

      if (!telefoneLimpo || telefoneLimpo.length < 10) {
        setErro('Informe um número de WhatsApp válido.')
        setCarregando(false)
        return
      }

      const foto_url = await uploadImagem()

      const { error } = await supabase.from('animals').insert({
        ...form,
        telefone: telefoneLimpo,
        foto_url,
        idade: Number(form.idade) || 0,
        user_id: user.id,
      })

      if (error) {
        throw new Error('Erro ao cadastrar animal.')
      }

      setSucesso('Animal cadastrado com sucesso!')
      setTimeout(() => navigate('/painel'), 1500)
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar animal. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="form-animal-card">
          <div className="form-animal-header">
            <h1>Cadastrar animal</h1>
            <p>Preencha as informações para colocar o animal disponível para adoção.</p>
          </div>

          {erro && <div className="msg-erro">{erro}</div>}
          {sucesso && <div className="msg-sucesso">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label>Nome do animal *</label>
                <input
                  name="nome"
                  placeholder="Ex: Rex, Mimi..."
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
                  placeholder="Ex: Labrador, SRD..."
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
                  placeholder="Ex: 2"
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
                  placeholder="Ex: Iguatu - CE"
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

            <div className="form-row">
              <div className="input-group">
                <label>Nome do tutor *</label>
                <input
                  name="nome_tutor"
                  placeholder="Seu nome"
                  value={form.nome_tutor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>WhatsApp *</label>
                <input
                  name="telefone"
                  placeholder="Ex: 88999999999"
                  value={form.telefone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>


            <div className="input-group">
              <label>Foto do animal</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
              />
            </div>

            <div className="input-group">
              <label>Descrição</label>
              <textarea
                name="descricao"
                placeholder="Conte um pouco sobre o animal: personalidade, saúde, histórico..."
                value={form.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="form-botoes">
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                <IoIosArrowBack /> Voltar
              </button>

              <button type="submit" className="btn-primary" disabled={carregando}>
                <FaCheck /> {carregando ? 'Cadastrando...' : 'Cadastrar animal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddAnimal