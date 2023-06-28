import { useParams } from 'react-router-dom'

import '../ShowEntity.scss'

export default function ShowItem() {
  const { id } = useParams()

  return (
    <>
      <main className="container mx-auto p-8 app-show-entity">
        <div className="max-w-3xl mx-auto">

          <div className="app-controls">
            <div>Showing item #{id}</div>
            <div className="app-right">

            </div>
          </div>

          <form>

          </form>

        </div>
      </main>
    </>
  )
}
