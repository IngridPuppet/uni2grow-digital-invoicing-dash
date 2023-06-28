import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'

import './Pager.scss'

type PagerProps = {
  paging: {
    curr: number
    currSize: number
    total: number
  },

  load: (page: number) => void
}

export default function Pager ({paging, load}: PagerProps) {
  return (
    <>
      {
        (paging.total > 0 && paging.currSize > 0) &&
          <div className="app-pager my-4 flex items-center justify-between">
            <div className="flex w-20">
              <button type="button" className="mr-auto" hidden={paging.curr == 0}
                      onClick={() => load(paging.curr - 1)}>
                <FaArrowLeftLong />
              </button>
            </div>

            <div>Showing page <span className="font-bold">{paging.curr + 1}</span> of {paging.total}</div>

            <div className="flex w-20">
              <button type="button" className="ml-auto" hidden={paging.curr + 1 == paging.total}
                      onClick={() => load(paging.curr + 1)}>
                <FaArrowRightLong />
              </button>
            </div>
          </div>
      }
    </>
  )
}
