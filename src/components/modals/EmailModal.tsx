import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button, Typography, Collapse, Box } from '@mui/material';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import type { Theme } from '@mui/material/styles';
import type { DatosCorreo } from '../../types';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { RichTextEditor, MenuControlsContainer, MenuSelectFontFamily, MenuSelectHeading, MenuSelectTextAlign, MenuDivider, MenuButtonBold, MenuButtonItalic, MenuButtonUnderline, MenuButtonStrikethrough, MenuButtonHighlightColor, MenuButtonOrderedList, MenuButtonBulletedList, MenuButtonRemoveFormatting, MenuButtonUndo, MenuButtonRedo } from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import {TextStyle} from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Highlight from '@tiptap/extension-highlight';
import { MuiChipsInput } from 'mui-chips-input'
interface EmailModalProps {
    open: boolean;
    onClose: () => void;
    onSend: (datos: DatosCorreo) => Promise<void> | void;
    selectedFolios?: string[];
    loading?: boolean;
}

export default function EmailModal({ open, onClose, onSend, selectedFolios = [], loading = false }: EmailModalProps) {
    const [form, setForm] = useState<DatosCorreo>({ destinatarios: '', asunto: '', mensaje: '', cc: '', cco: '' });
    const [errors, setErrors] = useState<{ destinatarios?: string; asunto?: string } >({});
    const [editorContent, setEditorContent] = useState(form.mensaje || '');
    const [destinatarios, setDestinatarios] = useState<string[]>([]);
    const [cc, setCc] = useState<string[]>([]);
    const [cco, setCco] = useState<string[]>([]);
    const [expandAttachments, setExpandAttachments] = useState(false);
    const validate = () => {
        const nextErrors: typeof errors = {};
        if (destinatarios.length === 0) nextErrors.destinatarios = 'Destinatarios es requerido';
        if (!form.asunto.trim()) nextErrors.asunto = 'Asunto es requerido';
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (key: keyof DatosCorreo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateDestinatarios = (chipValue: string) => {
        if (destinatarios.includes(chipValue)) {
            return {
                isError: true,
                textError: 'Este correo ya está en la lista'
            };
        }
        if (!isValidEmail(chipValue)) {
            return {
                isError: true,
                textError: 'Formato de correo inválido'
            };
        }
        return { isError: false, textError: '' };
    };

    const validateCc = (chipValue: string) => {
        if (cc.includes(chipValue)) {
            return {
                isError: true,
                textError: 'Este correo ya está en la lista'
            };
        }
        if (!isValidEmail(chipValue)) {
            return {
                isError: true,
                textError: 'Formato de correo inválido'
            };
        }
        return { isError: false, textError: '' };
    };

    const validateCco = (chipValue: string) => {
        if (cco.includes(chipValue)) {
            return {
                isError: true,
                textError: 'Este correo ya está en la lista'
            };
        }
        if (!isValidEmail(chipValue)) {
            return {
                isError: true,
                textError: 'Formato de correo inválido'
            };
        }
        return { isError: false, textError: '' };
    };

    const handleChangeDestinatarios = (chips: string[]): void => {
        setDestinatarios(chips);
        setForm(prev => ({ ...prev, destinatarios: chips.join(', ') }));
    }
    const handleChangeCc = (chips: string[]): void => {
        setCc(chips);
        setForm(prev => ({ ...prev, cc: chips.join(', ') }));
    }
    const handleChangeCco = (chips: string[]): void => {
        setCco(chips);
        setForm(prev => ({ ...prev, cco: chips.join(', ') }));
    }
    const handleSend = async () => {
        if (!validate()) return;
        await onSend({ ...form, mensaje: editorContent });
    };

    const handleClose = () => {
        // Limpiar todos los campos
        setForm({ destinatarios: '', asunto: '', mensaje: '', cc: '', cco: '' });
        setDestinatarios([]);
        setCc([]);
        setCco([]);
        setEditorContent('');
        setErrors({});
        setExpandAttachments(false);
        onClose();
    };

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEditorContent(form.mensaje || '');
        }
    }, [open, form.mensaje]);

        const renderFileItem = (folio: string,) => (
        <>
        <Box  
        sx={(theme) => ({ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(54, 54, 54, 0.3)',
                                    }),
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: 1, 
            marginBottom: 1,
        })}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                <PictureAsPdfIcon
                
                sx={{
                            color: 'error.main',
                          }}
                />
                <span style={{ fontSize: 13,}}>{folio}.pdf</span>
            </div>
            
        </Box>
        <Box  
        sx={(theme) => ({ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(54, 54, 54, 0.3)',
                                    }),
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            borderRadius: 1, 
            marginBottom: 1,
        })}>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <DescriptionIcon 
                sx={{
                            color: 'success.main',
                          }}
                />
                <span style={{ fontSize: 13, }}>{folio}.xml</span>
            </div>
        </Box>
        </>
    );

    const renderAttachedFiles = () => {
        const foliosToShow = selectedFolios;
        
        if (foliosToShow.length === 0) {
            return (
                <div style={{ 
                    padding: 12, 
                    borderRadius: 6,
                    marginBottom: 16 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
                        <strong>Sin documentos seleccionados</strong>
                    </div>
                </div>
            );
        }

        if (foliosToShow.length <= 2) {
            return (
                <Box sx={(theme) => ({
                    
                        backgroundColor: 'rgba(247, 247, 247, 1)',
                        ...theme.applyStyles('dark', {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }),
                        borderRadius: 1,
                        padding: 2,
                        marginBottom: 2,
                })}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
                        <strong>Archivos adjuntos ({foliosToShow.length * 2})</strong>
                        
                    </div>
                    <div>
                        {foliosToShow.map((folio) => renderFileItem(folio))}
                    </div>
                </Box>
            );
        }
         return (
            <div style={{ marginBottom: 16 }}>
                <Box
                sx={(theme) => ({
                                
                                    backgroundColor: 'rgba(247, 247, 247, 1)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    }),
                                    borderRadius: 1,
                                
                            })}>
                    <div 
                        key="attachments"
                        style={{
                            borderRadius: 6,
                        }}
                        
                    >
                        <Box 
                            onClick={() => setExpandAttachments(!expandAttachments)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', cursor: 'pointer' }}
                        >
                            <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
                            <strong>Archivos adjuntos ({foliosToShow.length * 2})</strong>
                            
                        <Button
                          variant="text"
                          
                          sx={{ fontSize: '0.875rem', ml: 'auto', color: 'primary.main' }}
                          startIcon={expandAttachments ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        >
                            {expandAttachments ? 'Ocultar Detalles' : 'Mostrar Detalles'}
                        </Button>
                        </Box>
                        
                        <Collapse 
                    in={expandAttachments}
                >
                    <Box 
                    
                    sx={{ maxHeight: 200, overflowY: 'auto', padding: '0 8px' }}>
                            {foliosToShow.map((folio) => renderFileItem(folio))}
                        </Box>
                </Collapse>
                    </div>
                
                </Box>
                
            </div>
        );
    };



    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 1%, hsla(210, 100%, 16%, 0.24), hsla(225, 31%, 5%, 0.74))',
                    }),
                }),
            }}
        >
            <DialogTitle sx={{ pb: 1.5, fontWeight: 700 }}>Enviar documentos por correo</DialogTitle>
            <DialogContent sx={{ pt: 1, pb: 0 }}>
                <Stack spacing={2.5}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">Destinatarios</Typography>
                        <MuiChipsInput 
                        value={destinatarios} 
                        onChange={handleChangeDestinatarios} 
                        validate={validateDestinatarios}
                        placeholder='Ingrese un correo y presione enter.'
                        error={!!errors.destinatarios}
                        helperText={errors.destinatarios}
                        fullWidth
                        size="small"
                        sx={(theme) => ({
                            '& .MuiInputBase-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                }),
                                borderRadius: 1,
                                minHeight: '40px',
                                height: 'auto',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                padding: '4px',
                            },
                        })}
                        hideClearAll
                        />
                        
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">CC</Typography>
                            <MuiChipsInput 
                            value={cc} 
                            onChange={handleChangeCc}
                            validate={validateCc}
                            hideClearAll
                            placeholder='Ingrese un correo y presione enter.'
                            size="small"
                        sx={(theme) => ({
                            '& .MuiInputBase-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                }),
                                borderRadius: 1,
                                minHeight: '40px',
                                height: 'auto',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                padding: '4px',
                            },
                        })}
                        />
                        </Stack>
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">CCO</Typography>
                            <MuiChipsInput 
                            value={cco} 
                            onChange={handleChangeCco}
                            validate={validateCco}
                            hideClearAll
                            placeholder='Ingrese un correo y presione enter.'
                            size="small"
                        sx={(theme) => ({
                            '& .MuiInputBase-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                }),
                                borderRadius: 1,
                                minHeight: '40px',
                                height: 'auto',
                                flexWrap: 'wrap',
                                alignItems: 'flex-start',
                                padding: '4px',
                            },
                        })}
                        />
                        
                        </Stack>
                    </Stack>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">Asunto</Typography>
                        <TextField
                            value={form.asunto}
                            onChange={handleChange('asunto')}
                            error={!!errors.asunto}
                            helperText={errors.asunto}
                            fullWidth
                            size="small"
                            sx={(theme) => ({
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    }),
                                    borderRadius: 1,
                                },
                            })}
                        />
                    </Stack>
                    <RichTextEditor
                        extensions={[
                            StarterKit,
                            TextStyle,
                            Color,
                            Highlight.configure({ multicolor: true }),
                            FontFamily,
                            TextAlign.configure({ types: ['heading', 'paragraph'] }),
                        ]}
                        sx={(theme: Theme) => ({
                            minHeight: '240px',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            ...theme.applyStyles('dark', {
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            }),
                            border: '1px solid',
                            borderColor: (theme.vars || theme).palette.divider,
                            borderRadius: 1,
                            '& .ProseMirror': {
                                backgroundColor: 'transparent',
                                color: (theme.vars || theme).palette.text.primary,
                                padding: theme.spacing(2),
                            },
                            '& .MuiTiptap-RichTextField-menuBarContent': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                            '& .MuiTiptap-FieldContainer-root .MuiTiptap-RichTextField-menuBarContent': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                            '& .MuiTiptap-MenuBar-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                        })}
                        content={editorContent}
                        onUpdate={({ editor }) => setEditorContent(editor.getHTML())}
                        renderControls={() => (
                            <MenuControlsContainer
                                sx={(theme) => ({
                                    backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                    }),
                                    color: (theme.vars || theme).palette.text.primary,
                                    border: '1px solid',
                                    borderColor: (theme.vars || theme).palette.divider,
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                    '& .MuiTiptap-MenuBar-content': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                        ...theme.applyStyles('dark', {
                                            backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                        }),
                                    },
                                    '& .MuiTiptap-RichTextField-menuBarContent': {
                                        backgroundColor: 'transparent !important',
                                    },
                                    '& .MuiButtonBase-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiSelect-select': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& svg': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiInputBase-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiMenuItem-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                        '& .MuiSvgIcon-root': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                        '& svg': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                    },
                                    '& .MuiMenu-paper': {
                                        backgroundColor: (theme.vars || theme).palette.background.paper,
                                        '& .MuiSvgIcon-root': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                        '& svg': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                    },
                                    '& .MuiList-root .MuiSvgIcon-root': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiList-root svg': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiTiptap-MenuSelectTextAlign-icon': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                })}
                            >
                                    <MenuSelectFontFamily
                                        options={[
                                            { label: 'Inter', value: 'Inter, sans-serif' },
                                            { label: 'Arial', value: 'Arial, sans-serif' },
                                            { label: 'Georgia', value: 'Georgia, serif' },
                                        ]}
                                        emptyLabel="Fuente"
                                        unsetOptionLabel="Predeterminado"
                                        tooltipTitle="Fuente"
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuSelectHeading
                                        labels={{
                                            paragraph: 'Párrafo',
                                            heading1: 'Encabezado 1',
                                            heading2: 'Encabezado 2',
                                            heading3: 'Encabezado 3',
                                            heading4: 'Encabezado 4',
                                            heading5: 'Encabezado 5',
                                            heading6: 'Encabezado 6',
                                        }}
                                        tooltipTitle="Estilo de párrafo"
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuSelectTextAlign
                                        emptyLabel="Alinear"
                                        tooltipTitle="Alineación de texto"
                                        options={[
                                            { value: 'left', IconComponent: FormatAlignLeft, label: 'Alinear a la izquierda' },
                                            { value: 'center', IconComponent: FormatAlignCenter, label: 'Centrar' },
                                            { value: 'right', IconComponent: FormatAlignRight, label: 'Alinear a la derecha' },
                                            { value: 'justify', IconComponent: FormatAlignJustify, label: 'Justificar' },
                                        ]}
                                        sx={(theme) => ({
                                            '& .MuiSelect-select': {
                                                color: ((theme as Theme).vars || theme).palette.text.primary,
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: 'hsl(220, 30%, 6%) !important',
                                                ...(theme as Theme).applyStyles('dark', {
                                                    color: 'hsl(0, 0%, 100%) !important',
                                                }),
                                            },
                                            '& .MuiSelect-icon': {
                                                color: ((theme as Theme).vars || theme).palette.text.primary,
                                            },
                                            '& [class*="MenuSelectTextAlign-icon"]': {
                                                color: 'hsl(220, 30%, 6%) !important',
                                                ...(theme as Theme).applyStyles('dark', {
                                                    color: 'hsl(0, 0%, 100%) !important',
                                                }),
                                            },
                                        })}
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: 'hsl(220, 30%, 6%) !important',
                                                                ...(theme as Theme).applyStyles('dark', {
                                                                    color: 'hsl(0, 0%, 100%) !important',
                                                                }),
                                                            },
                                                            '& svg': {
                                                                color: 'hsl(220, 30%, 6%) !important',
                                                                ...theme.applyStyles('dark', {
                                                                    color: 'hsl(0, 0%, 100%) !important',
                                                                }),
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuDivider />
                                    <MenuButtonBold tooltipLabel="Negrita" />
                                    <MenuButtonItalic tooltipLabel="Cursiva" />
                                    <MenuButtonUnderline tooltipLabel="Subrayado" />
                                    <MenuButtonStrikethrough tooltipLabel="Tachado" />
                                    <MenuDivider />
                                    <MenuButtonHighlightColor
                                        tooltipLabel="Color de resaltado"
                                        swatchColors={[
                                            { value: '#595959', label: 'Gris oscuro' },
                                            { value: '#dddddd', label: 'Gris claro' },
                                            { value: '#ffa6a6', label: 'Rojo claro' },
                                            { value: '#ffd699', label: 'Naranja claro' },
                                            { value: '#ffff00', label: 'Amarillo' },
                                            { value: '#99cc99', label: 'Verde claro' },
                                            { value: '#90c6ff', label: 'Azul claro' },
                                            { value: '#8085e9', label: 'Morado claro' },
                                        ]}
                                    />
                                    <MenuDivider />
                                    <MenuButtonOrderedList tooltipLabel="Lista numerada" />
                                    <MenuButtonBulletedList tooltipLabel="Lista con viñetas" />
                                    <MenuDivider />
                                    <MenuButtonRemoveFormatting tooltipLabel="Quitar formato" />
                                    <MenuDivider />
                                    <MenuButtonUndo tooltipLabel="Deshacer" />
                                    <MenuButtonRedo tooltipLabel="Rehacer" />
                                </MenuControlsContainer>
                        )} 
                    />
                    {renderAttachedFiles()}
                </Stack>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSend} variant="contained" disabled={loading || selectedFolios.length === 0}>Enviar</Button>
            </DialogActions>
        </Dialog>
    );
}