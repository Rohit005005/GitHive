"use client"
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { lucario} from 'react-syntax-highlighter/dist/esm/styles/prism' 

type Props = {
    filesReferences:{fileName :string,sourceCode:string,summary:string}[]
}

export const CodeReferences = ({filesReferences}: Props) => {
    const [tab,setTab]=React.useState(filesReferences[0]?.fileName)
    if(filesReferences.length ===0) return null

  return (
    <div className='sm:max-w-[73vw] max-w-[80vw]'>
        <Tabs value={tab} onValueChange={setTab}>
            <h1 className='font-bold text-lg'>File References</h1>
            <div className='overflow-x-scroll scrollbar-webkit  over flex gap-2 rounded-md p-3 mb-5'>
                {filesReferences.map(file =>(
                    <button key={file.fileName} onClick={()=> setTab(file.fileName)} className={cn(
                        'sm:px-3 px-1 py-1.5 text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap text-muted-foreground bg-gray-900 hover:bg-gray-700 hover:text-white',
                        {
                            'bg-primary hover:bg-primary text-primary-foreground ':tab === file.fileName,
                        }
                    )}>
                        {file.fileName}
                    </button>
                ))}
            </div>
            {filesReferences.map(file=>(
                <TabsContent value={file.fileName} key={file.fileName} className='max-h-[60vh] overflow-y-scroll sm:max-w-7xl rounded-md scrollbar-webkit sm:text-[16px] text-[10px]'>
                    <SyntaxHighlighter language='typescript' style={lucario}>
                        {file.sourceCode}
                    </SyntaxHighlighter>
                </TabsContent>
            ))}
        </Tabs>
    </div>
  )
}