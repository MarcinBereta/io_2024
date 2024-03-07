import React from 'react'
//If use Inside of component set "inside" property in tag to true (ex. <Pagination inside={true} />"

const Pagination = ({
    currentPage,
    maxPages,
    setPage,
}: {
    currentPage: number
    maxPages: number
    setPage: (page: number) => void
}) => {
    const generateItems = () => {
        let children = []

        for (let i = currentPage - 3; i <= currentPage + 3; i++) {
            if (i == currentPage) {
                children.push(
                    <li
                        key={i}
                        className="active cursor-default w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                    >
                        <a>{i}</a>
                    </li>
                )
            } else if (i >= 1 && i <= maxPages) {
                if (Math.abs(currentPage - i) <= 2) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect  cursor-pointer w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                            onClick={() => {
                                setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                } else if (i == 1 || i == maxPages) {
                    children.push(
                        <li
                            key={i}
                            className="waves-effect  cursor-pointer w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                            onClick={() => {
                                setPage(i)
                            }}
                        >
                            <a>{i}</a>
                        </li>
                    )
                }
            }
        }

        return children
    }

    return (
        <div>
            <ul className="flex flex-row gap-4">
                <li
                    className={`${currentPage == 1 ? 'pagination-chevron-disabled cursor-default' : 'pagination-chevron cursor-pointer'}  w-4 h-4 p-4 flex justify-center items-center bg-highlight2`}
                    onClick={() => {
                        if (currentPage != 1) {
                            setPage(currentPage - 1)
                        }
                    }}
                >
                    <a>{'<'}</a>
                </li>
                {currentPage > 4 ? (
                    <span>
                        <li
                            className="waves-effect cursor-pointer w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                            onClick={() => {
                                setPage(1)
                            }}
                        >
                            <a>1</a>
                        </li>
                        <li
                            className="disabled cursor-pointer w-4 h-4 p-4 flex justify-center items-center"
                            style={{ marginLeft: '15px' }}
                        >
                            <a>...</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                {generateItems()}
                {currentPage < maxPages - 3 ? (
                    <span className="flex flex-row">
                        <li
                            className="disabled cursor-pointer w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                            style={{ marginRight: '15px' }}
                        >
                            <a>...</a>{' '}
                        </li>
                        <li
                            className="waves-effect cursor-pointer w-4 h-4 p-4 flex justify-center items-center bg-highlight2"
                            onClick={() => {
                                setPage(maxPages)
                            }}
                        >
                            <a>{maxPages}</a>
                        </li>
                    </span>
                ) : (
                    <span></span>
                )}
                <li
                    className={`${currentPage == maxPages ? 'pagination-chevron-disabled cursor-default' : 'pagination-chevron cursor-pointer'}  w-4 h-4 p-4 flex justify-center items-center bg-highlight2`}
                    onClick={() => {
                        if (currentPage != maxPages) {
                            setPage(currentPage + 1)
                        }
                    }}
                >
                    <a>{'>'}</a>
                </li>
            </ul>
        </div>
    )
}

export { Pagination }
