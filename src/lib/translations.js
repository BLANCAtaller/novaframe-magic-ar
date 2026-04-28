const translations = {
  ES: {
    // === NAVBAR ===
    nav: [
      { name: 'Inicio', href: '/' },
      { name: 'Catálogo', href: '/marketplace' },
      { name: 'Laboratorio', href: '/laboratorio' },
      { name: 'Soporte', href: '/support' },
    ],

    // === HERO ===
    hero: {
      badge: 'NovaFrame Zenith v3.0 // EXTREME',
      arBadge: 'AR_AUGMENTED_REALITY_SYSTEM',
      titleLine1: 'EL ARTE ES',
      titleLine2: 'MUTACIÓN',
      description: 'Llevamos tus cuadros a una nueva dimensión. Combinamos la textura del canvas con la potencia de la',
      arLabel: 'Realidad Aumentada',
      descriptionEnd: '. Escanea tu pieza física para liberar una experiencia digital envolvente y mutante.',
      systemStatus: '[ SISTEMA_AR: ACTIVO ] // [ ESCANEO_AUMENTADO: 100% ] // [ CAPA_DIGITAL: VIRTUAL_LAYER ]',
      ctaPrimary: 'ACCEDER AL ARCHIVO',
      ctaSecondary: 'DISEÑOS PERSONALIZADOS',
      metrics: [
        { val: '1.8K', label: 'Unidades Desplegadas' },
        { val: '3.2M', label: 'Píxeles Pack Ambas' },
        { val: '72h', label: 'Protocolo de Envío' }
      ],
      marquee: {
        syncing: 'Sintonizando Archivo:',
        detecting: 'Detectando Mutaciones:',
        protocol: 'Protocolo de Autenticidad:'
      },
      terminal: {
        systemLoad: 'Carga_Sistema:',
        systemValue: 'MÁXIMO_ESFUERZO',
        syncBuffer: 'Sincro_Buffer:',
        syncValue: 'INESTABLE_99%'
      }
    },

    // === FOOTER ===
    footer: {
      tagline: 'Laboratorio de síntesis visual centrado en la creación de artefactos artísticos sobre lienzo premium y alta fidelidad tecnológica.',
      systemsTitle: 'Sistemas Centrales',
      systemLinks: [
        { name: 'Más Vendidos', href: '/top-deployments' },
        { name: 'Todos los Artefactos', href: '/top-deployments#all-artifacts' },
        { name: 'Laboratorio de Arte', href: '/top-deployments#preview-system' },
        { name: 'Hub de Operaciones', href: '/deployment-hub' }
      ],
      protocolsTitle: 'Protocolos',
      protocolLinks: [
        { name: 'Pilares de Servicio', href: '/support#pillars' },
        { name: 'Dudas Frecuentes', href: '/support#faq' },
        { name: 'Uplink Directo', href: '/support#contact' }
      ],
      copyright: 'NOVAFRAME // ZENITH VERSIÓN 3.0.42 // TODOS LOS DERECHOS RESERVADOS',
      location: 'Centinela_Chihuahua',
      ssl: 'Encriptado_SSL'
    },

    // === SUPPORT PAGE ===
    support: {
      heroDesc: 'Infraestructura de resolución y logística operativa de alta fidelidad. Accede a los protocolos de información o establece un enlace directo con el equipo central para escalar tu solicitud.',
      pillarsTitle: 'NUESTROS PROTOCOLOS',
      pillarsSubtitle: 'Pilares de Servicio',
      pillars: [
        {
          id: 'shipping', idFull: 'NVF-PR-01', title: 'Logística', iconType: 'globe',
          description: 'Enviamos tu arte a cualquier parte de México. Cuidamos cada detalle del empaque para que tu cuadro llegue perfecto y a tiempo a tu puerta.',
          status: 'SYS_LINK_OK', latency: '12ms'
        },
        {
          id: 'security', idFull: 'NVF-PR-02', title: 'Calidad', iconType: 'shield',
          description: 'Usamos materiales de alta calidad y bastidores de madera sólida. Nuestros lienzos están hechos para durar y mantener sus colores vibrantes por años.',
          status: 'INTG_VERIFIED', latency: '5ms'
        },
        {
          id: 'custom', idFull: 'NVF-PR-03', title: 'Personalización', iconType: 'zap',
          description: 'Diseña tu cuadro ideal en nuestro Laboratorio de Arte. Visualiza el resultado final en tu espacio antes de que lo fabriquemos para ti.',
          status: 'SYNC_ACTIVE', latency: '54ms'
        }
      ],
      faqTitle: 'DUDAS FRECUENTES',
      faqSubtitle: 'Archivo Táctico de Información',
      faqs: [
        { question: "¿Cómo rastrear mi pedido?", answer: "Te enviaremos un código de rastreo por correo electrónico en cuanto tu paquete sea despachado para que puedas seguirlo hasta tu casa." },
        { question: "¿Qué cubre la garantía?", answer: "Garantizamos la calidad de los materiales y la fidelidad del color. Si tu cuadro tiene algún defecto de fabricación, lo resolvemos de inmediato." },
        { question: "¿Puedo cambiar el diseño después de la compra?", answer: "Una vez que el cuadro entra a impresión no se pueden hacer cambios. Te recomendamos revisar bien tu diseño en el visualizador antes de confirmar." },
        { question: "¿Hacen envíos a todo México?", answer: "Sí, enviamos a todo el territorio nacional. Cuidamos el empaque para prevenir cualquier daño durante el trayecto, sin importar la distancia." }
      ],
      reviews: [
        { quote: "La neta me daba miedo pedir un cuadro tan grande por internet, pero llegó súper bien protegido. El bastidor está macizo y los colores resaltan bien chulo en mi sala.", user: "Ximena Cárdenas", sector: "Polanco, CDMX", rating: 5 },
        { quote: "Pedí un Canvas Premium de mis fotos de la boda y quedó de lujo. Se nota que no es cualquier impresión, la textura de la tela le da un toque muy elegante.", user: "Gerardo Villarreal", sector: "San Pedro Garza García, NL", rating: 4 },
        { quote: "El servicio por WhatsApp fue de 10, me ayudaron a elegir el tamaño ideal para mi oficina. El envío a Zapopan fue más rápido de lo que esperaba. Recomendados.", user: "Daniela Ochoa", sector: "Zapopan, Jalisco", rating: 5 },
        { quote: "Es la tercera vez que les compro y nunca fallan. La calidad del montaje es impecable, se ve que le meten detalle a cada pieza. Una chulada de trabajo.", user: "Mateo Iturbide", sector: "Querétaro, Qro.", rating: 4 },
        { quote: "Buscaba algo diferente para mi recámara y el tríptico que armé en el laboratorio quedó increíble. La fidelidad de los colores es otro nivel. ¡Gracias!", user: "Renata Espinoza", sector: "Mérida, Yucatán", rating: 5 }
      ],
      trustFeatures: [
        { title: "4.9/5 Estrellas", detail: "En más de 15,000 reseñas" },
        { title: "Envío Gratis", detail: "En pedidos +$75" },
        { title: "Satisfacción Garantizada", detail: "Color que no se desvanece" },
        { title: "Calidad Premium", detail: "Tecnología HP Latex" }
      ],
      trustStats: [
        { value: "1,640", suffix: "+", label: "Clientes Felices", target: 1640 },
        { value: "1,800", suffix: "+", label: "Unidades Desplegadas", target: 1800 },
        { value: "3.2", suffix: "M", label: "Píxeles Pack Ambas", target: 3.2 },
        { value: "72", suffix: "h", label: "Protocolo de Envío", target: 72 }
      ],
      contactTitle: 'UPLINK DIRECTO',
      contactSubtitle: 'Transmisión Segura',
      contactDesc: 'Si tu consulta requiere un escalado técnico de alta prioridad, inicia una transmisión cifrada directa con el equipo central.',
      contactSuccessTitle: 'Link Establecido',
      contactSuccessSubtitle: 'Protocolo Encriptado. Respuesta esperada: < 24h',
      formId: 'ID_USUARIO',
      formNamePlace: 'TU NOMBRE',
      formEmail: 'ENLACE_CORREO',
      formEmailPlace: 'CORREO ELECTRÓNICO',
      formPhone: 'CANAL_VOZ',
      formPhonePlace: 'TELÉFONO DE CONTACTO',
      formMethod: 'CANAL_COMUNICACION',
      formType: 'TIPO_PROTOCOLO',
      formMessage: 'CARGA_DATOS',
      formMessagePlace: 'INSERTA AQUÍ EL CONTENIDO DEL PROTOCOLO...',
      formSending: 'ENCRIPTANDO DATOS...',
      formSubmit: 'INICIAR TRANSMISIÓN',
      whatsappTitle: 'ENLACE DIRECTO',
      whatsappSubtitle: 'SISTEMA DE CONTACTO DIRECTO',
      whatsappDesc: 'Escanea el código QR o utiliza el enlace seguro para iniciar una transmisión directa con nuestro equipo técnico y de ventas. Respuesta garantizada en menos de 48 horas bajo protocolo de prioridad.',
      whatsappBtn: 'ABRIR WHATSAPP_UPLINK',
      gpsStatus: 'Enlace Satelital: Activo',
      gpsBtn: 'INICIAR ENLACE GPS',
      syncingFlux: 'Sincronizando Flujo...',
      accessibility: 'ACCESIBILIDAD',
      locData: 'DATOS_UBICACIÓN',
      schedule: {
        weekdays: 'L—V:',
        weekdaysTime: '09:00—18:00',
        saturday: 'SAB:',
        saturdayTime: '10:00—14:00'
      },
      heroStatus: 'RED DE SOPORTE OPERATIVA',
      scroll: 'SCROLL PARA EXPLORAR',
      monitor: [
        { label: "SISTEMA LOGÍSTICO", status: "ESTABLE", color: "pink" },
        { label: "DETECTANDO MUTACIONES", status: "CRÍTICO", color: "cyan" },
        { label: "PROTOCOLO DE AUTENTICIDAD", status: "ACTIVO", color: "yellow" },
        { label: "SISTEMA_ZENITH", status: "ESTABLE", color: "cyan" },
        { label: "ENLACE_NEURAL", status: "SINCRONIZADO", color: "yellow" },
        { label: "DATALINK_ESTABLISHED", status: "ENCRIPTADO", color: "pink" }
      ],
      formOptions: {
        method: {
          whatsapp: 'WHATSAPP LINK',
          email: 'ENLACE EMAIL',
          voice: 'LLAMADA DE VOZ',
          telegram: 'TELEGRAM ENC.'
        },
        reason: {
          support: 'SOPORTE TÉCNICO',
          sales: 'VENTAS / COTIZACIÓN',
          warranty: 'PROCESO DE GARANTÍA',
          shipping: 'LOGÍSTICA / RASTREO',
          collab: 'COLABORACIÓN PRO',
          other: 'REQUERIMIENTO EXTERNO'
        }
      },
      tags: {
        channelStatus: 'ESTADO_CANAL',
        responseTime: 'TIEMPO_RESPUESTA',
        responseTimeVal: '< 48 HORAS // PROTOCOLO_ALPHA',
        efficiency: 'EFICIENCIA_DESPLIEGUE',
        integrity: 'ÍNDICE_INTEGRIDAD'
      }
    },

    // === PHYSICAL GALLERY ===
    gallery: {
      badge: 'PRESENCIA_FÍSICA',
      title: 'GALERÍA',
      locationLabel: 'UBICACIÓN_CENTRAL',
      location: 'CHIHUAHUA, MÉXICO',
      address: 'Infonavit Nacional, 31120',
      description: 'Experimenta la calidad de los lienzos antirreflejantes y observa nuestros sistemas de marcos físicos en un entorno de exhibición profesional.',
      features: ['Lienzos Pro', 'Marcos Sólidos', 'Asesoría VIP', 'Showroom'],
      cta: 'CONTACTAR ASESOR'
    },

    // === WHATSAPP FAB ===
    whatsappFab: {
      status: 'SUPPORT_UPLINK',
      interfaceLabel: 'Interface: Nova_Live',
      description: '¿Dudas sobre materiales o pedidos especiales? Inicia el protocolo de chat con un especialista.',
      cta: 'INICIAR PROTOCOLO'
    },

    // === ERROR PAGES ===
    error: {
      title: 'Error del Sistema',
      subtitle: 'Fallo_Crítico // Protocolo de recuperación disponible',
      retry: 'Reintentar',
      home: 'Ir al Inicio'
    },
    notFound: {
      title: 'Señal Perdida',
      subtitle: 'Error_de_Enlace // Ruta no reconocida por el sistema',
      home: 'Volver al Inicio',
      catalog: 'Catálogo'
    },
    // === LAB PAGE ===
    lab: {
      hero: {
        systemTitle: 'SISTEMA DE SÍNTESIS VISUAL',
        title: 'LABORATORIO',
        subtitle: 'PIEZAS CUSTOM',
        descriptionPrefix: 'Protocolos de renderizado y síntesis para',
        descriptionSuffix: 'Sincroniza tu visión creativa y activa el motor de',
        descriptionEnd: 'para materializar tu obra.',
        authorPieces: 'piezas de autor',
        highFidelity: 'alta fidelidad',
        steps: [
          { title: "CARGAR ARTE", desc: "Sube tu archivo (PNG, JPG o TIFF) directo al procesador." },
          { title: "SINCRONIZAR 3D", desc: "El sistema mapea tu obra en tiempo real sobre el lienzo.", done: "Mapeo completado con éxito." },
          { title: "AMBIENTE REAL", desc: "Mira cómo interactúa la luz con tu arte en una sala 3D." }
        ],
        terminal: {
          header: 'TERMINAL_SUBIDA_v4',
          upload: {
            analyzing: 'ANALIZANDO_MATRIZ',
            ready: 'ARCHIVO_LISTO',
            initial: 'CARGA_INICIAL',
            analyzingDesc: 'VERIFICANDO DENSIDAD DE PÍXELES...',
            readyDesc: 'SISTEMA PREPARADO PARA PROYECCIÓN',
            initialDesc: 'ARRASTRA TU OBRA O HAZ CLICK AQUÍ'
          },
          metadata: {
            file: 'ARCHIVO',
            weight: 'PESO',
            structure: 'ESTRUCTURA',
            resolution: 'RESOLUCION',
            ultraHd: 'ULTRA_HD'
          },
          cta: {
            processing: 'PROCESANDO MATRIZ',
            locked: 'BLOQUEADO // ESPERANDO NODO',
            done: 'VINCULACIÓN 3D COMPLETA',
            sync: 'SINCRONIZAR ARTEFACTO',
            deploy: 'FINALIZAR DESPLIEGUE',
            artifactName: 'OBRA_LABORATORIO'
          }
        }
      },
      frames: {
        badge: 'SISTEMA_DE_ENMARCADO',
        title: '_Marcos',
        desc: 'Nuestra selección de marcos es simple y elegante. Contamos con 5 colores distintos para nuestros cuadros, diseñados para dar un toque distinguido y selecto a tus espacios.',
        materialBase: 'Material_Base',
        polyTitle: 'Poliestireno 360°',
        polyDesc: 'Marcos de poliestireno de alta densidad. Un producto sustentable bajo proceso 360°, ofreciendo resistencia estructural y ligereza.',
        colorPalette: 'Paleta_De_Colores',
        colors: {
          ninguno: 'Sin Marco',
          madera: 'Madera',
          blanco: 'Blanco',
          negro: 'Negro',
          plata: 'Plata',
          oro: 'Oro'
        },
        dimParams: 'Parámetros_Dimensionales',
        largeFormat: 'Formato Mayor (Large/XL)',
        largeDesc: 'Para cuadros de 120x80cm, 90x60cm, 80x80cm y 60x60cm. Utilizamos un marco de arquitectura reforzada con 3.6cm de profundidad y 1.8cm de perfil frontal.',
        standardFormat: 'Formato Estándar (Medium/Small)',
        standardDesc: 'Para cuadros de 60x45cm, 45x30cm y 30x30cm. Empleamos un marco estilizado con 1.7cm de profundidad y 1.7cm de perfil frontal.',
        configCustom: 'CONFIGURACIÓN CUSTOM',
        configDesc: 'Los perfiles se adaptan automáticamente en el Deployment Hub.'
      },
      holography: {
         badge: 'Módulo de Holografía',
         collage: { title: 'Desfragmentación Espacial', desc: 'Un motor de diseño que rompe tu imagen en fragmentos armónicos, suspendidos en múltiples capas de profundidad para crear una narrativa visual tridimensional.' },
         audio: { title: 'Resonancia Orbital', desc: 'Ondas acústicas invisibles que orbitan tu pieza. Al escanear el cuadro, la frecuencia exacta de tu recuerdo se decodifica y reproduce en el espacio físico.' },
         ar: { title: 'Mapeo Holográfico', desc: 'Proyección volumétrica que trasciende el marco físico. Una matriz de datos cobra vida frente a tus ojos, fusionando la realidad física con la digital.' },
         aura: { title: 'Refracción Ambiental', desc: 'Un núcleo lumínico inteligente en el reverso del lienzo que emite un halo atmosférico, controlando el "mood" de tu entorno físico en tiempo real.' },
         layers: {
           physical: 'Cuadro Físico',
           virtual: 'Diseño Virtual AR',
           scanner: 'Escáner Dispositivo'
         }
      }
    }
  },

  EN: {
    // === NAVBAR ===
    nav: [
      { name: 'Home', href: '/' },
      { name: 'Catalog', href: '/marketplace' },
      { name: 'Laboratory', href: '/laboratorio' },
      { name: 'Support', href: '/support' },
    ],

    // === HERO ===
    hero: {
      badge: 'NovaFrame Zenith v3.0 // EXTREME',
      arBadge: 'AR_AUGMENTED_REALITY_SYSTEM',
      titleLine1: 'ART IS',
      titleLine2: 'MUTATION',
      description: 'We take your artwork to a new dimension. We combine the texture of canvas with the power of',
      arLabel: 'Augmented Reality',
      descriptionEnd: '. Scan your physical piece to unlock an immersive, ever-evolving digital experience.',
      systemStatus: '[ AR_SYSTEM: ACTIVE ] // [ AUGMENTED_SCAN: 100% ] // [ DIGITAL_LAYER: VIRTUAL_LAYER ]',
      ctaPrimary: 'ACCESS THE ARCHIVE',
      ctaSecondary: 'CUSTOM DESIGNS',
      metrics: [
        { val: '1.8K', label: 'Units Deployed' },
        { val: '3.2M', label: 'Pixel Pack Both' },
        { val: '72h', label: 'Shipping Protocol' }
      ],
      marquee: {
        syncing: 'Syncing Archive:',
        detecting: 'Detecting Mutations:',
        protocol: 'Authenticity Protocol:'
      },
      terminal: {
        systemLoad: 'System_Load:',
        systemValue: 'MAXIMUM_EFFORT',
        syncBuffer: 'Sync_Buffer:',
        syncValue: 'UNSTABLE_99%'
      }
    },

    // === FOOTER ===
    footer: {
      tagline: 'Visual synthesis laboratory focused on creating artistic artifacts on premium canvas and high-fidelity technology.',
      systemsTitle: 'Core Systems',
      systemsTitle: 'Core Systems',
      systemLinks: [
        { name: 'Best Sellers', href: '/top-deployments' },
        { name: 'All Artifacts', href: '/top-deployments#all-artifacts' },
        { name: 'Art Laboratory', href: '/top-deployments#preview-system' },
        { name: 'Operations Hub', href: '/deployment-hub' }
      ],
      protocolsTitle: 'Protocols',
      protocolLinks: [
        { name: 'Service Pillars', href: '/support#pillars' },
        { name: 'FAQ', href: '/support#faq' },
        { name: 'Direct Uplink', href: '/support#contact' }
      ],
      copyright: 'NOVAFRAME // ZENITH VERSION 3.0.42 // ALL RIGHTS RESERVED',
      location: 'Sentinel_Chihuahua',
      ssl: 'SSL_Encrypted'
    },

    // === SUPPORT PAGE ===
    support: {
      heroDesc: 'High-fidelity resolution infrastructure and operational logistics. Access information protocols or establish a direct uplink with the core team to escalate your request.',
      pillarsTitle: 'OUR PROTOCOLS',
      pillarsSubtitle: 'Service Pillars',
      pillars: [
        {
          id: 'shipping', idFull: 'NVF-PR-01', title: 'Logistics', iconType: 'globe',
          description: 'We ship your art anywhere in Mexico. We take care of every packaging detail so your canvas arrives perfect and on time.',
          status: 'SYS_LINK_OK', latency: '12ms'
        },
        {
          id: 'security', idFull: 'NVF-PR-02', title: 'Quality', iconType: 'shield',
          description: 'We use high-quality materials and solid wood stretcher bars. Our canvases are built to last and keep their vibrant colors for years.',
          status: 'INTG_VERIFIED', latency: '5ms'
        },
        {
          id: 'custom', idFull: 'NVF-PR-03', title: 'Customization', iconType: 'zap',
          description: 'Design your ideal canvas in our Art Laboratory. Preview the final result in your space before we manufacture it for you.',
          status: 'SYNC_ACTIVE', latency: '54ms'
        }
      ],
      faqTitle: 'FAQ',
      faqSubtitle: 'Tactical Information Archive',
      faqs: [
        { question: "How do I track my order?", answer: "We'll send you a tracking code via email as soon as your package is dispatched so you can follow it all the way home." },
        { question: "What does the warranty cover?", answer: "We guarantee material quality and color fidelity. If your canvas has any manufacturing defect, we'll resolve it immediately." },
        { question: "Can I change the design after purchase?", answer: "Once the canvas enters the printing phase, changes can't be made. We recommend reviewing your design carefully in the previewer before confirming." },
        { question: "Do you ship nationwide?", answer: "Yes, we ship across the entire country. We take extra care with packaging to prevent any damage during transit, regardless of the distance." }
      ],
      reviews: [
        { quote: "I was honestly nervous ordering such a large canvas online, but it arrived perfectly protected. The frame is solid and the colors pop beautifully in my living room.", user: "Ximena Cárdenas", sector: "Polanco, CDMX", rating: 5 },
        { quote: "I ordered a Canvas Premium of my wedding photos and it turned out amazing. You can tell it's not just any print — the fabric texture adds such an elegant touch.", user: "Gerardo Villarreal", sector: "San Pedro Garza García, NL", rating: 4 },
        { quote: "Their WhatsApp support was a 10/10. They helped me choose the perfect size for my office. Shipping to Zapopan was faster than expected. Highly recommended.", user: "Daniela Ochoa", sector: "Zapopan, Jalisco", rating: 5 },
        { quote: "Third time ordering and they never disappoint. The mounting quality is impeccable — you can tell they put real attention into every piece. Amazing work.", user: "Mateo Iturbide", sector: "Querétaro, Qro.", rating: 4 },
        { quote: "I was looking for something different for my bedroom and the triptych I designed in the lab turned out incredible. The color accuracy is on another level. Thank you!", user: "Renata Espinoza", sector: "Mérida, Yucatán", rating: 5 }
      ],
      trustFeatures: [
        { title: "4.9/5 Stars", detail: "From 15,000+ reviews" },
        { title: "Free Shipping", detail: "On orders +$75" },
        { title: "Satisfaction Guaranteed", detail: "Fade-proof colors" },
        { title: "Premium Quality", detail: "HP Latex Technology" }
      ],
      trustStats: [
        { value: "1,640", suffix: "+", label: "Happy Customers", target: 1640 },
        { value: "1,800", suffix: "+", label: "Units Deployed", target: 1800 },
        { value: "3.2", suffix: "M", label: "Pixel Pack Both", target: 3.2 },
        { value: "72", suffix: "h", label: "Shipping Protocol", target: 72 }
      ],
      contactTitle: 'DIRECT UPLINK',
      contactSubtitle: 'Secure Transmission',
      contactDesc: 'If your inquiry requires a high-priority technical escalation, initiate a direct encrypted transmission with the core team.',
      contactSuccessTitle: 'Link Established',
      contactSuccessSubtitle: 'Encrypted Protocol. Expected response: < 24h',
      formId: 'USER_ID',
      formNamePlace: 'YOUR NAME',
      formEmail: 'EMAIL_LINK',
      formEmailPlace: 'EMAIL ADDRESS',
      formPhone: 'VOICE_CHANNEL',
      formPhonePlace: 'CONTACT PHONE',
      formMethod: 'COMMUNICATION_CHANNEL',
      formType: 'PROTOCOL_TYPE',
      formMessage: 'DATA_LOAD',
      formMessagePlace: 'INSERT PROTOCOL CONTENT HERE...',
      formSending: 'ENCRYPTING DATA...',
      formSubmit: 'START TRANSMISSION',
      whatsappTitle: 'DIRECT LINK',
      whatsappSubtitle: 'DIRECT CONTACT SYSTEM',
      whatsappDesc: 'Scan the QR code or use the secure link to start a direct transmission with our technical and sales team. Guaranteed response in less than 48 hours under priority protocol.',
      whatsappBtn: 'OPEN WHATSAPP_UPLINK',
      gpsStatus: 'Satellite Link: Active',
      gpsBtn: 'START GPS LINK',
      syncingFlux: 'Syncing Flux...',
      accessibility: 'ACCESIBILITY',
      locData: 'LOC_DATA',
      schedule: {
        weekdays: 'M—F:',
        weekdaysTime: '09:00—18:00',
        saturday: 'SAT:',
        saturdayTime: '10:00—14:00'
      },
      heroStatus: 'SUPPORT NETWORK OPERATIONAL',
      scroll: 'SCROLL TO EXPLORE',
      monitor: [
        { label: "LOGISTICS SYSTEM", status: "STABLE", color: "pink" },
        { label: "DETECTING MUTATIONS", status: "CRITICAL", color: "cyan" },
        { label: "AUTHENTICITY PROTOCOL", status: "ACTIVE", color: "yellow" },
        { label: "ZENITH_SYSTEM", status: "STABLE", color: "cyan" },
        { label: "NEURAL_LINK", status: "SYNCED", color: "yellow" },
        { label: "DATALINK_ESTABLISHED", status: "ENCRYPTED", color: "pink" }
      ],
      formOptions: {
        method: {
          whatsapp: 'WHATSAPP LINK',
          email: 'EMAIL LINK',
          voice: 'VOICE CALL',
          telegram: 'TELEGRAM ENC.'
        },
        reason: {
          support: 'TECHNICAL SUPPORT',
          sales: 'SALES / QUOTATION',
          warranty: 'WARRANTY PROCESS',
          shipping: 'LOGISTICS / TRACKING',
          collab: 'PRO COLLABORATION',
          other: 'EXTERNAL REQUIREMENT'
        }
      },
      tags: {
        channelStatus: 'CHANNEL_STATUS',
        responseTime: 'RESPONSE_TIME',
        responseTimeVal: '< 48 HOURS // ALPHA_PROTOCOL',
        efficiency: 'DEPLOYMENT_EFFICIENCY',
        integrity: 'INTEGRITY_INDEX'
      }
    },

    // === PHYSICAL GALLERY ===
    gallery: {
      badge: 'PHYSICAL_PRESENCE',
      title: 'GALLERY',
      locationLabel: 'CENTRAL_LOCATION',
      location: 'CHIHUAHUA, MEXICO',
      address: 'Infonavit Nacional, 31120',
      description: 'Experience the quality of anti-glare canvases and see our physical frame systems in a professional exhibition setting.',
      features: ['Pro Canvases', 'Solid Frames', 'VIP Advisory', 'Showroom'],
      cta: 'CONTACT ADVISOR'
    },

    // === WHATSAPP FAB ===
    whatsappFab: {
      status: 'SUPPORT_UPLINK',
      interfaceLabel: 'Interface: Nova_Live',
      description: 'Questions about materials or custom orders? Start a chat protocol with a specialist.',
      cta: 'START PROTOCOL'
    },

    // === ERROR PAGES ===
    error: {
      title: 'System Error',
      subtitle: 'Critical_Failure // Recovery protocol available',
      retry: 'Retry',
      home: 'Go Home'
    },
    notFound: {
      title: 'Signal Lost',
      subtitle: 'Link_Error // Route not recognized by the system',
      home: 'Back to Home',
      catalog: 'Catalog'
    },
    // === LAB PAGE ===
    lab: {
      hero: {
        systemTitle: 'VISUAL SYNTHESIS SYSTEM',
        title: 'LABORATORY',
        subtitle: 'CUSTOM PIECES',
        descriptionPrefix: 'Rendering and synthesis protocols for',
        descriptionSuffix: 'Synchronize your creative vision and activate the',
        descriptionEnd: 'engine to materialize your work.',
        authorPieces: 'author pieces',
        highFidelity: 'high fidelity',
        steps: [
          { title: "UPLOAD ART", desc: "Upload your file (PNG, JPG, or TIFF) directly to the processor." },
          { title: "SYNC 3D", desc: "The system maps your work in real-time onto the canvas.", done: "Mapping completed successfully." },
          { title: "REAL ENVIRONMENT", desc: "See how light interacts with your art in a 3D room." }
        ],
        terminal: {
          header: 'UPLOAD_TERMINAL_v4',
          upload: {
            analyzing: 'ANALYZING_MATRIX',
            ready: 'FILE_READY',
            initial: 'INITIAL_UPLOAD',
            analyzingDesc: 'VERIFYING PIXEL DENSITY...',
            readyDesc: 'SYSTEM PREPARED FOR PROJECTION',
            initialDesc: 'DRAG YOUR WORK OR CLICK HERE'
          },
          metadata: {
            file: 'FILE',
            weight: 'WEIGHT',
            structure: 'STRUCTURE',
            resolution: 'RESOLUTION',
            ultraHd: 'ULTRA_HD'
          },
          cta: {
            processing: 'PROCESSING MATRIX',
            locked: 'LOCKED // AWAITING NODE',
            done: '3D LINK COMPLETE',
            sync: 'SYNCHRONIZE ARTIFACT',
            deploy: 'FINALIZE DEPLOYMENT',
            artifactName: 'LAB_WORK'
          }
        }
      },
      frames: {
        badge: 'FRAMING_SYSTEM',
        title: '_Frames',
        desc: 'Our selection of frames is simple and elegant. We have 5 different colors for our pieces, designed to give a distinguished and select touch to your spaces.',
        materialBase: 'Base_Material',
        polyTitle: '360° Polystyrene',
        polyDesc: 'High-density polystyrene frames. A sustainable product under a 360° process, offering structural resistance and lightness.',
        colorPalette: 'Color_Palette',
        colors: {
          ninguno: 'No Frame',
          madera: 'Wood',
          blanco: 'White',
          negro: 'Black',
          plata: 'Silver',
          oro: 'Gold'
        },
        dimParams: 'Dimensional_Parameters',
        largeFormat: 'Large Format (Large/XL)',
        largeDesc: 'For 120x80cm, 90x60cm, 80x80cm and 60x60cm pieces. We use a reinforced architectural frame with 3.6cm depth and 1.8cm front profile.',
        standardFormat: 'Standard Format (Medium/Small)',
        standardDesc: 'For 60x45cm, 45x30cm and 30x30cm pieces. We use a stylized frame with 1.7cm depth and 1.7cm front profile.',
        configCustom: 'CUSTOM CONFIGURATION',
        configDesc: 'Profiles adapt automatically in the Deployment Hub.',
        holography: {
          badge: 'Holography Module',
          collage: { title: 'Spatial Defragmentation', desc: 'A design engine that breaks your image into harmonic fragments, suspended in multiple layers of depth to create a three-dimensional visual narrative.' },
          audio: { title: 'Orbital Resonance', desc: 'Invisible acoustic waves that orbit your piece. By scanning the frame, the exact frequency of your memory is decoded and reproduced in physical space.' },
          ar: { title: 'Holographic Mapping', desc: 'Volumetric projection that transcends the physical frame. A data matrix comes to life before your eyes, merging physical and digital reality.' },
          aura: { title: 'Ambient Refraction', desc: 'A smart light core on the back of the canvas that emits an atmospheric halo, controlling the mood of your physical environment in real-time.' },
          layers: {
            physical: 'Physical Frame',
            virtual: 'Virtual AR Design',
            scanner: 'Device Scanner'
          }
        }
      }
    }
  }
};

export default translations;
