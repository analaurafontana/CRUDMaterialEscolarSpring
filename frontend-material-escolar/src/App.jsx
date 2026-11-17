import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen, Package, Search, Plus, Pencil, Trash2, RefreshCw,
  X, Save, Boxes, CircleDollarSign, Truck, AlertCircle, CheckCircle2
} from 'lucide-react'

const API = '/material-escolar'

const emptyForm = { nome: '', quantidade: '', preco: '', fornecedor: '' }

function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  })
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })

  if (!response.ok) {
    let message = `Erro ${response.status}: não foi possível concluir a operação.`
    try {
      const data = await response.json()
      message = data.message || data.error || message
    } catch {
      const text = await response.text()
      if (text) message = text
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export default function App() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState('')
  const [searchResult, setSearchResult] = useState(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    if (!term) return materials
    return materials.filter(item =>
      [item.nome, item.fornecedor, String(item.id)].some(value =>
        String(value ?? '').toLocaleLowerCase('pt-BR').includes(term)
      )
    )
  }, [materials, search])

  const totalItems = materials.reduce((sum, item) => sum + Number(item.quantidade || 0), 0)
  const totalValue = materials.reduce((sum, item) => sum + Number(item.quantidade || 0) * Number(item.preco || 0), 0)

  function showNotice(message, type = 'success') {
    setNotice({ message, type })
    window.setTimeout(() => setNotice(null), 3500)
  }

  async function loadMaterials() {
    setLoading(true)
    setError('')
    try {
      const data = await request(API)
      setMaterials(Array.isArray(data) ? data : [])
      setSearchResult(null)
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os materiais.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadMaterials() }, [])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(item) {
    setEditingId(item.id)
    setForm({
      nome: item.nome ?? '',
      quantidade: String(item.quantidade ?? ''),
      preco: String(item.preco ?? ''),
      fornecedor: item.fornecedor ?? ''
    })
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
  }

  async function submitForm(event) {
    event.preventDefault()
    if (!form.nome.trim() || form.quantidade === '' || form.preco === '' || !form.fornecedor.trim()) {
      showNotice('Preencha todos os campos antes de salvar.', 'error')
      return
    }
    const quantidade = Number(form.quantidade)
    const preco = Number(form.preco)
    if (!Number.isInteger(quantidade) || quantidade < 0 || !Number.isFinite(preco) || preco < 0) {
      showNotice('Informe uma quantidade inteira e valores numéricos válidos.', 'error')
      return
    }

    const payload = {
      nome: form.nome.trim(),
      quantidade,
      preco,
      fornecedor: form.fornecedor.trim()
    }

    setSaving(true)
    try {
      if (editingId !== null) {
        await request(`${API}?id=${encodeURIComponent(editingId)}`, {
          method: 'PUT', body: JSON.stringify(payload)
        })
        showNotice('Material atualizado com sucesso.')
      } else {
        await request(API, { method: 'POST', body: JSON.stringify(payload) })
        showNotice('Material cadastrado com sucesso.')
      }
      closeForm()
      await loadMaterials()
    } catch (err) {
      showNotice(err.message || 'Erro ao salvar material.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteMaterial(item) {
    const confirmed = window.confirm(`Deseja realmente excluir "${item.nome}"?`)
    if (!confirmed) return
    try {
      await request(`${API}?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      showNotice('Material excluído com sucesso.')
      await loadMaterials()
    } catch (err) {
      showNotice(err.message || 'Não foi possível excluir o material.', 'error')
    }
  }

  async function searchByName(event) {
    event.preventDefault()
    const term = search.trim()
    if (!term) {
      setSearchResult(null)
      await loadMaterials()
      return
    }
    // A listagem local permite pesquisar por nome, fornecedor ou ID.
    // A busca específica por nome usa o endpoint GET /material-escolar?nome=
    try {
      const found = await request(`${API}?nome=${encodeURIComponent(term)}`)
      setSearchResult(found ? [found] : [])
      setError('')
    } catch (err) {
      // Caso a busca exata por nome não encontre resultado, mantém a busca local.
      const local = materials.filter(item =>
        item.nome?.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR'))
      )
      setSearchResult(local)
      if (!local.length) showNotice('Nenhum material encontrado com esse nome.', 'error')
    }
  }

  async function clearSearch() {
    setSearch('')
    setSearchResult(null)
    await loadMaterials()
  }

  const visibleMaterials = searchResult ?? filtered

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><BookOpen size={23} /></div>
          <div><strong>Materialize</strong><span>GESTÃO ESCOLAR</span></div>
        </div>
        <div className="side-label">MENU PRINCIPAL</div>
        <div className="nav-item active"><Package size={18} /> Materiais</div>
        <div className="sidebar-bottom">
          <div className="side-note-icon"><Boxes size={18} /></div>
          <p>Organize seu estoque escolar de um jeito simples.</p>
          <span>Cadastro de materiais</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Painel <span>/</span> <b>Materiais escolares</b></div>
          <div className="topbar-right"><span className="status-dot" /> API de materiais</div>
        </header>

        <section className="page-heading">
          <div>
            <div className="eyebrow">CONTROLE DE ESTOQUE</div>
            <h1>Materiais escolares</h1>
            <p>Gerencie os materiais, quantidades, preços e fornecedores.</p>
          </div>
          <button className="primary-button" onClick={openNew}><Plus size={18} /> Novo material</button>
        </section>

        {error && <div className="error-banner"><AlertCircle size={18} /><span>{error}</span><button onClick={loadMaterials}>Tentar novamente</button></div>}

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon blue"><Package size={20} /></div>
            <div><span className="stat-label">Materiais cadastrados</span><strong>{materials.length}</strong><small>itens diferentes</small></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon purple"><Boxes size={20} /></div>
            <div><span className="stat-label">Unidades em estoque</span><strong>{totalItems}</strong><small>unidades somadas</small></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon green"><CircleDollarSign size={20} /></div>
            <div><span className="stat-label">Valor estimado</span><strong>{money(totalValue)}</strong><small>quantidade × preço</small></div>
          </article>
        </section>

        <section className="table-panel">
          <div className="panel-heading">
            <div><h2>Lista de materiais</h2><p>Consulte e gerencie os itens cadastrados.</p></div>
            <button className="icon-button refresh-button" title="Atualizar lista" onClick={loadMaterials}><RefreshCw size={17} /></button>
          </div>
          <form className="search-bar" onSubmit={searchByName}>
            <Search size={18} />
            <input value={search} onChange={e => { setSearch(e.target.value); setSearchResult(null) }} placeholder="Buscar por nome, fornecedor ou ID..." />
            {search && <button type="button" className="clear-search" onClick={clearSearch}><X size={16} /></button>}
            <button type="submit" className="search-button">Buscar</button>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>MATERIAL</th><th>ID</th><th>QUANTIDADE</th><th>PREÇO UNITÁRIO</th><th>FORNECEDOR</th><th className="actions-head">AÇÕES</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6"><div className="loading-state"><span className="spinner" /> Carregando materiais...</div></td></tr>
                ) : visibleMaterials.length === 0 ? (
                  <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Package size={25} /></div><strong>Nenhum material encontrado</strong><span>Cadastre um novo material ou ajuste sua busca.</span><button onClick={openNew}>Adicionar material</button></div></td></tr>
                ) : visibleMaterials.map(item => (
                  <tr key={item.id}>
                    <td><div className="material-cell"><div className="material-avatar"><BookOpen size={17} /></div><strong>{item.nome}</strong></div></td>
                    <td><span className="id-pill">#{item.id}</span></td>
                    <td><span className="quantity-pill">{item.quantidade} un.</span></td>
                    <td className="price-cell">{money(item.preco)}</td>
                    <td><div className="supplier-cell"><Truck size={15} /> {item.fornecedor}</div></td>
                    <td><div className="row-actions">
                      <button className="action-button edit" title="Editar" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                      <button className="action-button delete" title="Excluir" onClick={() => deleteMaterial(item)}><Trash2 size={16} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer"><span>Exibindo <b>{visibleMaterials.length}</b> de <b>{materials.length}</b> materiais</span><span>Dados conectados à API Java Spring Boot</span></div>
        </section>
        <footer className="footer">Materialize <span>•</span> Sistema de cadastro de materiais escolares</footer>
      </main>

      {formOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) closeForm() }}>
        <section className="modal">
          <div className="modal-header">
            <div><div className="modal-kicker">{editingId !== null ? 'ATUALIZAÇÃO DE REGISTRO' : 'NOVO REGISTRO'}</div><h2>{editingId !== null ? 'Editar material' : 'Cadastrar material'}</h2><p>Preencha as informações do material escolar.</p></div>
            <button className="icon-button" onClick={closeForm}><X size={19} /></button>
          </div>
          <form onSubmit={submitForm}>
            <label>Nome do material<input name="nome" value={form.nome} onChange={updateField} placeholder="Ex.: Caderno universitário" autoFocus /></label>
            <div className="form-row">
              <label>Quantidade<input name="quantidade" type="number" min="0" step="1" value={form.quantidade} onChange={updateField} placeholder="Ex.: 50" /></label>
              <label>Preço unitário (R$)<input name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={updateField} placeholder="Ex.: 12,90" /></label>
            </div>
            <label>Fornecedor<input name="fornecedor" value={form.fornecedor} onChange={updateField} placeholder="Nome do fornecedor" /></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={closeForm}>Cancelar</button><button type="submit" className="primary-button" disabled={saving}>{saving ? <span className="button-spinner" /> : <Save size={17} />}{saving ? 'Salvando...' : 'Salvar material'}</button></div>
          </form>
        </section>
      </div>}

      {notice && <div className={`toast ${notice.type}`}><span>{notice.type === 'success' ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}</span>{notice.message}<button onClick={() => setNotice(null)}><X size={16} /></button></div>}
    </div>
  )
}