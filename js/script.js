// Biến toàn cục để quản lý timeout đóng tooltip
let tooltipCloseTimeout = null

// Dữ liệu tooltip cho các điểm tiện ích (cir IDs)
const facilityTooltips = {
  'cir1': 'Bảng tên dự án',
  'cir1-2': 'Chỗ ngồi thư giãn',
  'cir2': 'Khu đón tiếp & sân chơi nước',
  'cir3': 'Chỗ ngồi thư giãn',
  'cir3-2': 'Chỗ ngồi thư giãn',
  'cir3-3': 'Chỗ ngồi thư giãn',
  'cir3-4': 'Chỗ ngồi thư giãn',
  'cir3-5': 'Chỗ ngồi thư giãn',
  'cir3-6': 'Chỗ ngồi thư giãn',
  'cir3-7': 'Chỗ ngồi thư giãn',
  'cir4': 'Vườn hoa',
  'cir4-2': 'Vườn hoa',
  'cir5': 'Trạm xử lý nước thải',
  'cir6': 'Nhà vệ sinh công cộng',
  'cir7': 'Sân thể thao đa năng',
  'cir8': 'Đường chạy khởi động',
  'cir9': 'Tượng điêu khắc điểm nhấn',
  'cir10': 'Khu vực kỹ thuật',
  'cir11': 'Sân tập thể dục',
  'cir12': 'Quảng trường đa năng',
  'cir13': 'Cầu đi bộ điểm nhấn',
  'cir13-2': 'Cầu đi bộ điểm nhấn',
  'cir14': 'Khán đài ngoài trời',
  'cir15': 'Chòi nghỉ/sân khấu nhỏ',
  'cir16': 'Không gian nhạc nước',
  'cir17': 'Lối tiếp cận từ nội khu',
  'cir18': 'Công viên thú cưng',
  'cir19': 'Vườn thảo mộc',
  'cir20': 'Đường reflexology',
  'cir21': 'Khu vực BBQ',
  'cir22': 'Bãi cỏ đa năng',
  'cir23': 'Sàn gỗ ngắm cảnh',
  'cir24': 'Sân chơi trẻ em'
}

// Khởi tạo khi trang load xong và SVG đã được load
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra xem SVG đã được load chưa
  const checkSvgLoaded = () => {
    const mapSvg = document.getElementById("mapSvg")
    if (mapSvg) {
      initializeMap()
    } else {
      // Nếu chưa có SVG, đợi event svgLoaded
      window.addEventListener('svgLoaded', () => {
        initializeMap()
      }, { once: true })
    }
  }

  // Delay nhỏ để đảm bảo SVG fetch đã chạy
  setTimeout(checkSvgLoaded, 100)
})

function initializeMap() {
  const mapSvg = document.getElementById("mapSvg")

  if (!mapSvg) {
    console.error("Không tìm thấy mapSvg")
    return
  }

  // Kiểm tra xem dữ liệu đã được load chưa
  if (typeof propertyData === 'undefined') {
    console.error('Dữ liệu chưa được load. Vui lòng đảm bảo data.js được load trước script.js')
    return
  }

  // Thêm event listeners trực tiếp vào các SVG elements có class tongthe-building
    // Sử dụng requestAnimationFrame để đảm bảo DOM đã render xong
    requestAnimationFrame(() => {
      setTimeout(() => {
      setupBuildingInteractions()
      }, 50)
    })

  // Setup path tròn (lối vào khu thương mại) với delay
  setTimeout(() => {
    setupSpecialPath()
  }, 100)

  // Xử lý hover vào tooltip
  const tooltip = document.getElementById("tooltip")
  if (tooltip) {
    tooltip.addEventListener("mouseenter", () => {
      // Hủy timeout đóng tooltip nếu đang có
      if (tooltipCloseTimeout) {
        clearTimeout(tooltipCloseTimeout)
        tooltipCloseTimeout = null
      }
    })
    
    tooltip.addEventListener("mouseleave", () => {
      closeTooltipWithDelay()
    })
  }
}

function setupBuildingInteractions() {
  const mapSvg = document.getElementById("mapSvg")
  if (!mapSvg) return

  // Tìm tất cả các <g> elements có ID trong propertyData
  // Bao gồm cả những phần tử có class tongthe-building và những phần tử chỉ có ID
  const allGroups = mapSvg.querySelectorAll('g[id]')
  const processedIds = new Set() // Để tránh xử lý trùng lặp
  
  let setupCount = 0
  
  allGroups.forEach((building) => {
    const buildingId = building.getAttribute('id')
    
    if (!buildingId || processedIds.has(buildingId)) {
    return
  }

    // Kiểm tra xem có phải là cir ID (tiện ích) không
    if (buildingId.startsWith('cir') && facilityTooltips[buildingId]) {
      // Đánh dấu đã xử lý
      processedIds.add(buildingId)

      // Đảm bảo pointer-events hoạt động cho cả group và các phần tử con
      building.style.pointerEvents = 'all'
      building.style.cursor = 'pointer'
      
      // Đảm bảo tất cả phần tử con cũng có pointer-events
      const children = building.querySelectorAll('*')
      children.forEach(child => {
        if (child.style) {
          child.style.pointerEvents = 'all'
        }
      })

      // Thêm event listener hover cho tiện ích
      const handleMouseEnter = (e) => {
        e.stopPropagation()
        // Hủy timeout đóng tooltip nếu đang có
        if (tooltipCloseTimeout) {
          clearTimeout(tooltipCloseTimeout)
          tooltipCloseTimeout = null
        }
        showCustomTooltip(facilityTooltips[buildingId], e)
      }
      
      const handleMouseLeave = (e) => {
        e.stopPropagation()
        // Đóng tooltip với delay nhỏ để tránh đóng ngay khi di chuyển chuột
        closeTooltipWithDelay()
      }
      
      const handleMouseMove = (e) => {
        e.stopPropagation()
        const tooltip = document.getElementById("tooltip")
        if (tooltip && !tooltip.classList.contains("hidden")) {
          positionTooltip(e)
        }
      }

      // Thêm event listeners cho cả group và các phần tử con
      building.addEventListener("mouseenter", handleMouseEnter, true)
      building.addEventListener("mouseleave", handleMouseLeave, true)
      building.addEventListener("mousemove", handleMouseMove, true)
      
      // Thêm cho các phần tử con
      children.forEach(child => {
        child.addEventListener("mouseenter", handleMouseEnter, true)
        child.addEventListener("mouseleave", handleMouseLeave, true)
        child.addEventListener("mousemove", handleMouseMove, true)
      })

      setupCount++
      return
    }

    // Kiểm tra xem có dữ liệu cho building này không (propertyData)
    const data = propertyData[buildingId]
    if (!data) {
      return // Không có dữ liệu, bỏ qua
    }

    // Đánh dấu đã xử lý
    processedIds.add(buildingId)
    
    // Đảm bảo pointer-events hoạt động cho cả group và các phần tử con
    building.style.pointerEvents = 'all'
    building.style.cursor = 'pointer'
    
    // Đảm bảo tất cả phần tử con cũng có pointer-events
    const children = building.querySelectorAll('*')
    children.forEach(child => {
      if (child.style) {
        child.style.pointerEvents = 'all'
      }
    })

    // Thêm event listener hover
    const handleMouseEnter = (e) => {
      e.stopPropagation()
      // Hủy timeout đóng tooltip nếu đang có
      if (tooltipCloseTimeout) {
        clearTimeout(tooltipCloseTimeout)
        tooltipCloseTimeout = null
      }
      showTooltip(buildingId, e)
    }
    
    const handleMouseLeave = (e) => {
      e.stopPropagation()
      // Đóng tooltip với delay nhỏ để tránh đóng ngay khi di chuyển chuột
      closeTooltipWithDelay()
    }
    
    const handleMouseMove = (e) => {
      e.stopPropagation()
      const tooltip = document.getElementById("tooltip")
      if (tooltip && !tooltip.classList.contains("hidden")) {
        positionTooltip(e)
      }
    }

    // Thêm event listeners cho cả group và các phần tử con
    building.addEventListener("mouseenter", handleMouseEnter, true)
    building.addEventListener("mouseleave", handleMouseLeave, true)
    building.addEventListener("mousemove", handleMouseMove, true)
    
    // Thêm cho các phần tử con
    children.forEach(child => {
      child.addEventListener("mouseenter", handleMouseEnter, true)
      child.addEventListener("mouseleave", handleMouseLeave, true)
      child.addEventListener("mousemove", handleMouseMove, true)
    })

    setupCount++
  })

  console.log(`Đã setup ${setupCount} building interactions`)
}

// Hàm này không còn cần thiết vì SVG đã có sẵn hover và ID
// Giữ lại để tham khảo hoặc có thể xóa sau
// function createClickableAreas() { ... }

function showTooltip(propertyId, event) {
  const data = propertyData[propertyId]
  if (!data) return

  // Hủy timeout đóng tooltip nếu đang có
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
    tooltipCloseTimeout = null
  }

  const tooltip = document.getElementById("tooltip")
  if (!tooltip) return

  // Hiển thị lại các dòng đã ẩn (nếu có)
  const tooltipFloorEl = document.querySelector("#tooltipFloor")
  const tooltipAreaEl = document.querySelector("#tooltipArea")
  const floorRow = tooltipFloorEl ? tooltipFloorEl.closest(".info-row") : null
  const areaRow = tooltipAreaEl ? tooltipAreaEl.closest(".info-row") : null
  if (floorRow) floorRow.style.display = ""
  if (areaRow) areaRow.style.display = ""

  // Cập nhật nội dung tooltip
  const tooltipUnit = document.getElementById("tooltipUnit")
  const tooltipFloor = document.getElementById("tooltipFloor")
  const tooltipArea = document.getElementById("tooltipArea")
  
  if (tooltipUnit) tooltipUnit.textContent = data.unit || data.name
  if (tooltipFloor) tooltipFloor.textContent = data.floor || "N/A"
  if (tooltipArea) tooltipArea.textContent = data.area

  // Hiển thị lại icon (ô vuông bullet) cho tooltip buildings
  const tooltipUnitRow = tooltipUnit ? tooltipUnit.closest(".info-row") : null
  const iconUnit = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-icon.icon-unit") : null
  if (iconUnit) {
    iconUnit.style.display = ""
  }

  // Đảm bảo chữ "Căn: " hiển thị cho tooltip buildings
  const tooltipText = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-text") : null
  if (tooltipText) {
    // Kiểm tra xem đã có "Căn: " chưa
    const firstChild = tooltipText.firstChild
    if (!firstChild || (firstChild.nodeType === 3 && !firstChild.textContent.includes("Căn:"))) {
      // Nếu chưa có, thêm vào
      const cănText = document.createTextNode("Căn: ")
      tooltipText.insertBefore(cănText, tooltipText.firstChild)
    } else if (firstChild.nodeType === 1) {
      // Nếu firstChild là element, thêm text node trước nó
      const cănText = document.createTextNode("Căn: ")
      tooltipText.insertBefore(cănText, firstChild)
    }
  }

  // Hiển thị tooltip ngay lập tức
  tooltip.classList.remove("hidden")
  tooltip.style.display = "block"

  // Tính toán vị trí tooltip ngay
  if (event) {
    positionTooltip(event)
  }
  
  // Thêm class show sau một chút để animation hoạt động
  requestAnimationFrame(() => {
    tooltip.classList.add("show")
  })
}

function showCustomTooltip(content, event) {
  // Hủy timeout đóng tooltip nếu đang có
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
    tooltipCloseTimeout = null
  }

  const tooltip = document.getElementById("tooltip")
  if (!tooltip) return

  // Cập nhật nội dung tooltip với nội dung tùy chỉnh
  const tooltipUnit = document.getElementById("tooltipUnit")
  const tooltipFloor = document.getElementById("tooltipFloor")
  const tooltipArea = document.getElementById("tooltipArea")
  
  if (tooltipUnit) tooltipUnit.textContent = content
  if (tooltipFloor) tooltipFloor.textContent = ""
  if (tooltipArea) tooltipArea.textContent = ""

  // Ẩn các dòng không cần thiết
  const tooltipFloorEl = document.querySelector("#tooltipFloor")
  const tooltipAreaEl = document.querySelector("#tooltipArea")
  const floorRow = tooltipFloorEl ? tooltipFloorEl.closest(".info-row") : null
  const areaRow = tooltipAreaEl ? tooltipAreaEl.closest(".info-row") : null
  if (floorRow) floorRow.style.display = "none"
  if (areaRow) areaRow.style.display = "none"

  // Ẩn icon (ô vuông bullet) cho tooltip cir
  const tooltipUnitRow = tooltipUnit ? tooltipUnit.closest(".info-row") : null
  const iconUnit = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-icon.icon-unit") : null
  if (iconUnit) {
    iconUnit.style.display = "none"
  }

  // Ẩn chữ "Căn: " cho tooltip cir
  const tooltipText = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-text") : null
  if (tooltipText) {
    // Tìm và ẩn text node "Căn: "
    const textNodes = Array.from(tooltipText.childNodes).filter(node => node.nodeType === 3)
    textNodes.forEach(node => {
      if (node.textContent.trim() === "Căn:") {
        node.textContent = ""
      }
    })
  }

  tooltip.classList.remove("hidden")
  tooltip.style.display = "block"

  if (event) {
    positionTooltip(event)
  }
  
  requestAnimationFrame(() => {
    tooltip.classList.add("show")
  })
}

function setupSpecialPath() {
  const mapSvg = document.getElementById("mapSvg")
  if (!mapSvg) return

  const specialPaths = [
    {
      d: 'M240.918 368.835',
      fill: '#8E2A2A',
      tooltip: 'Lối vào khu thương mại'
    },
    {
      d: 'M194.064 266.489',
      fill: '#8E2A2A',
      tooltip: 'Hồ bơi'
    }
  ]

  const paths = mapSvg.querySelectorAll('path')
  paths.forEach((path) => {
    const d = path.getAttribute('d')
    const fill = path.getAttribute('fill')
    
    const specialPath = specialPaths.find(sp => 
      d && d.includes(sp.d) && fill === sp.fill
    )
    
    if (specialPath) {
      path.style.pointerEvents = 'all'
      path.style.cursor = 'pointer'
      
      path.addEventListener("mouseenter", (e) => {
        e.stopPropagation()
        path.style.stroke = '#ff0000'
        path.style.strokeWidth = '3px'
        showCustomTooltip(specialPath.tooltip, e)
      })
      
      path.addEventListener("mouseleave", (e) => {
        e.stopPropagation()
        path.style.stroke = ''
        path.style.strokeWidth = ''
        closeTooltipWithDelay()
      })
      
      path.addEventListener("mousemove", (e) => {
        e.stopPropagation()
        const tooltip = document.getElementById("tooltip")
        if (tooltip && !tooltip.classList.contains("hidden")) {
          positionTooltip(e)
        }
      })
    }
  })
}

function positionTooltip(event) {
  const tooltip = document.getElementById("tooltip")
  const tooltipRect = tooltip.getBoundingClientRect()

  const mouseX = event.clientX || event.pageX
  const mouseY = event.clientY || event.pageY

  let left = mouseX + 20
  let top = mouseY - tooltipRect.height / 2

  if (left + tooltipRect.width > window.innerWidth - 20) {
    left = mouseX - tooltipRect.width - 20
  }

  if (top < 20) {
    top = 20
  }

  if (top + tooltipRect.height > window.innerHeight - 20) {
    top = window.innerHeight - tooltipRect.height - 20
  }

  tooltip.style.left = left + "px"
  tooltip.style.top = top + "px"
}

function closeTooltipWithDelay() {
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
  }
  
  tooltipCloseTimeout = setTimeout(() => {
    const tooltip = document.getElementById("tooltip")
    if (tooltip && !tooltip.matches(':hover')) {
      tooltip.classList.remove("show")
      setTimeout(() => {
        if (!tooltip.matches(':hover')) {
        tooltip.classList.add("hidden")
          tooltip.style.display = "none"
        }
      }, 200)
    }
    tooltipCloseTimeout = null
  }, 150) 
}

function closeTooltip() {
  // Hủy timeout nếu có
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
    tooltipCloseTimeout = null
  }
  
  const tooltip = document.getElementById("tooltip")
  if (tooltip) {
    tooltip.classList.remove("show")
    setTimeout(() => {
      tooltip.classList.add("hidden")
    }, 300)
  }
}

function getStatusText(status) {
  const statusMap = {
    available: "Còn trống",
    reserved: "Đã đặt cọc",
    sold: "Đã bán",
  }
  return statusMap[status] || status
}

// ============================================
// Role Second Modal First Slider - Desktop
// ============================================
let roleSecondModalFirstCurrentSlide = 0

function moveRoleSecondModalFirstSlide(direction) {
  const slides = document.querySelectorAll('.role-second-modal-first-slide')
  const track = document.querySelector('.role-second-modal-first-track')

  if (!slides.length || !track) return

  // Remove active class from current slide
  slides[roleSecondModalFirstCurrentSlide].classList.remove('active')

  // Calculate new slide index
  roleSecondModalFirstCurrentSlide = (roleSecondModalFirstCurrentSlide + direction + slides.length) % slides.length

  // Add active class to new slide
  slides[roleSecondModalFirstCurrentSlide].classList.add('active')

  // Move the track
  const offset = -roleSecondModalFirstCurrentSlide * 100
  track.style.transform = `translateX(${offset}%)`
}

// ============================================
// Role Second Modal First Slider - Mobile
// ============================================
let roleSecondModalFirstCurrentSlideMobile = 0

function moveRoleSecondModalFirstSlideMobile(direction) {
  const slides = document.querySelectorAll('.role-second-modal-first-slide-mobile')
  const track = document.querySelector('.role-second-modal-first-track-mobile')

  if (!slides.length || !track) return

  // Remove active class from current slide
  slides[roleSecondModalFirstCurrentSlideMobile].classList.remove('active')

  // Calculate new slide index
  roleSecondModalFirstCurrentSlideMobile = (roleSecondModalFirstCurrentSlideMobile + direction + slides.length) % slides.length

  // Add active class to new slide
  slides[roleSecondModalFirstCurrentSlideMobile].classList.add('active')

  // Move the track
  const offset = -roleSecondModalFirstCurrentSlideMobile * 100
  track.style.transform = `translateX(${offset}%)`
}

// ============================================
// Role Frame Slider - Desktop
// ============================================
let roleFrameCurrentSlide = 0

function moveRoleFrameSlide(direction) {
  const slides = document.querySelectorAll('.desktop-only .frame-slide')
  const track = document.querySelector('.desktop-only .frame-slider-track')

  if (!slides.length || !track) return

  // Remove active class from current slide
  slides[roleFrameCurrentSlide].classList.remove('active')

  // Calculate new slide index
  roleFrameCurrentSlide = (roleFrameCurrentSlide + direction + slides.length) % slides.length

  // Add active class to new slide
  slides[roleFrameCurrentSlide].classList.add('active')

  // Move the track
  const offset = -roleFrameCurrentSlide * 100
  track.style.transform = `translateX(${offset}%)`
}

// ============================================
// Role Frame Slider - Mobile
// ============================================
let roleFrameCurrentSlideMobile = 0

function moveRoleFrameSlideMobile(direction) {
  const slides = document.querySelectorAll('.mobile-only .frame-slide-mobile')
  const track = document.querySelector('.mobile-only .frame-slider-track-mobile')

  if (!slides.length || !track) return

  // Remove active class from current slide
  slides[roleFrameCurrentSlideMobile].classList.remove('active')

  // Calculate new slide index
  roleFrameCurrentSlideMobile = (roleFrameCurrentSlideMobile + direction + slides.length) % slides.length

  // Add active class to new slide
  slides[roleFrameCurrentSlideMobile].classList.add('active')

  // Move the track
  const offset = -roleFrameCurrentSlideMobile * 100
  track.style.transform = `translateX(${offset}%)`
}
