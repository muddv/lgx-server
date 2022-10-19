import { defineSyncMapActions } from '@logux/actions'                                                                        
  export const SUBPROTOCOL = '1.0.0'                                                                   
 // base text vakue
	export type TextValue = {        
    id: string        
    userId: string        
    text: string        
  }        
         
	// text actions
  export const [        
    createText,        
    editText,        
    deleteText,        
    createdText,        
    editedText,        
    deletedText        
  ] = defineSyncMapActions<TextValue>('text')        
          
  export type CreateText = ReturnType<typeof createText>        
  export type CreatedText = ReturnType<typeof createdText>        
  export type DeleteText = ReturnType<typeof deleteText>        
  export type DeletedText = ReturnType<typeof deletedText>  
