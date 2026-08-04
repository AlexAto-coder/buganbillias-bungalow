-- ==========================================
-- BASE DE DATOS BUGANVILLIAS
-- ==========================================

USE buganvillias;

-- ==========================================
-- TABLA HABITACIONES
-- ==========================================

USE buganvillias;

CREATE TABLE IF NOT EXISTS habitaciones (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    descripcion TEXT,

    precio_noche DECIMAL(10,2) NOT NULL,

    capacidad INT NOT NULL,

    imagen VARCHAR(255),

    estado ENUM('disponible','mantenimiento') DEFAULT 'disponible',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- CLIENTES
-- =====================================

CREATE TABLE IF NOT EXISTS clientes (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombres VARCHAR(120) NOT NULL,

    correo VARCHAR(150) NOT NULL UNIQUE,

    telefono VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =====================================
-- RESERVAS
-- =====================================

CREATE TABLE IF NOT EXISTS reservas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(40) UNIQUE,

    cliente_id INT NOT NULL,

    habitacion_id INT NOT NULL,

    fecha_ingreso DATE NOT NULL,

    fecha_salida DATE NOT NULL,

    noches INT NOT NULL,

    personas INT NOT NULL,

    precio_noche DECIMAL(10,2),

    total DECIMAL(10,2),

    estado ENUM(

        'pendiente',

        'pagado',

        'cancelado'

    ) DEFAULT 'pendiente',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(cliente_id)
    REFERENCES clientes(id),

    FOREIGN KEY(habitacion_id)
    REFERENCES habitaciones(id)

);

-- =====================================
-- PAGOS
-- =====================================

CREATE TABLE IF NOT EXISTS pagos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    reserva_id INT NOT NULL,

    metodo VARCHAR(60),

    referencia VARCHAR(150),

    monto DECIMAL(10,2),

    estado ENUM(

        'pendiente',

        'pagado',

        'rechazado'

    ) DEFAULT 'pendiente',

    fecha_pago DATETIME,

    FOREIGN KEY(reserva_id)
    REFERENCES reservas(id)

);

-- =====================================
-- RESEÑAS
-- =====================================

CREATE TABLE IF NOT EXISTS resenas (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(120),

    comentario TEXT,

    calificacion INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS usuarios (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100),

    usuario VARCHAR(100) UNIQUE,

    password VARCHAR(255),

    rol ENUM(

        'admin',

        'recepcion'

    ) DEFAULT 'recepcion'

);

-- =====================================
-- CONFIGURACIÓN
-- =====================================


CREATE TABLE IF NOT EXISTS configuracion (

    id INT AUTO_INCREMENT PRIMARY KEY,

    hotel VARCHAR(150),

    direccion VARCHAR(200),

    ciudad VARCHAR(80),

    departamento VARCHAR(80),

    pais VARCHAR(80),

    telefono VARCHAR(40),

    correo VARCHAR(120)

);