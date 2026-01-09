
let tooltipCloseTimeout = null
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
document.addEventListener("DOMContentLoaded", () => {
  const checkSvgLoaded = () => {
    const mapSvg = document.getElementById("mapSvg")
    if (mapSvg) {
      initializeMap()
    } else {
      window.addEventListener('svgLoaded', () => {
        initializeMap()
      }, { once: true })
    }
  }
  setTimeout(checkSvgLoaded, 100)
})
function initializeMap() {
  const mapSvg = document.getElementById("mapSvg")
  if (!mapSvg) {
    return
  }
  if (typeof propertyData === 'undefined') {
    return
  }
  requestAnimationFrame(() => {
    setTimeout(() => {
      setupBuildingInteractions()
    }, 50)
  })
  setTimeout(() => {
    setupSpecialPath()
  }, 100)
  const tooltip = document.getElementById("tooltip")
  if (tooltip) {
    tooltip.addEventListener("mouseenter", () => {
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
  const allGroups = mapSvg.querySelectorAll('g[id]')
  const processedIds = new Set()
  let setupCount = 0
  allGroups.forEach((building) => {
    const buildingId = building.getAttribute('id')
    if (!buildingId || processedIds.has(buildingId)) {
      return
    }
    if (buildingId.startsWith('cir') && facilityTooltips[buildingId]) {
      processedIds.add(buildingId)
      building.style.pointerEvents = 'all'
      building.style.cursor = 'pointer'
      const children = building.querySelectorAll('*')
      children.forEach(child => {
        if (child.style) {
          child.style.pointerEvents = 'all'
        }
      })
      const handleMouseEnter = (e) => {
        e.stopPropagation()
        if (tooltipCloseTimeout) {
          clearTimeout(tooltipCloseTimeout)
          tooltipCloseTimeout = null
        }
        showCustomTooltip(facilityTooltips[buildingId], e)
      }
      const handleMouseLeave = (e) => {
        e.stopPropagation()
        closeTooltipWithDelay()
      }
      const handleMouseMove = (e) => {
        e.stopPropagation()
        const tooltip = document.getElementById("tooltip")
        if (tooltip && !tooltip.classList.contains("hidden")) {
          positionTooltip(e)
        }
      }
      building.addEventListener("mouseenter", handleMouseEnter, true)
      building.addEventListener("mouseleave", handleMouseLeave, true)
      building.addEventListener("mousemove", handleMouseMove, true)
      children.forEach(child => {
        child.addEventListener("mouseenter", handleMouseEnter, true)
        child.addEventListener("mouseleave", handleMouseLeave, true)
        child.addEventListener("mousemove", handleMouseMove, true)
      })
      setupCount++
      return
    }
    const data = propertyData[buildingId]
    if (!data) {
      return
    }
    processedIds.add(buildingId)
    building.style.pointerEvents = 'all'
    building.style.cursor = 'pointer'
    const children = building.querySelectorAll('*')
    children.forEach(child => {
      if (child.style) {
        child.style.pointerEvents = 'all'
      }
    })
    const handleMouseEnter = (e) => {
      e.stopPropagation()
      if (tooltipCloseTimeout) {
        clearTimeout(tooltipCloseTimeout)
        tooltipCloseTimeout = null
      }
      showTooltip(buildingId, e)
    }
    const handleMouseLeave = (e) => {
      e.stopPropagation()
      closeTooltipWithDelay()
    }
    const handleMouseMove = (e) => {
      e.stopPropagation()
      const tooltip = document.getElementById("tooltip")
      if (tooltip && !tooltip.classList.contains("hidden")) {
        positionTooltip(e)
      }
    }
    building.addEventListener("mouseenter", handleMouseEnter, true)
    building.addEventListener("mouseleave", handleMouseLeave, true)
    building.addEventListener("mousemove", handleMouseMove, true)
    children.forEach(child => {
      child.addEventListener("mouseenter", handleMouseEnter, true)
      child.addEventListener("mouseleave", handleMouseLeave, true)
      child.addEventListener("mousemove", handleMouseMove, true)
    })
    setupCount++
  })
}
function showTooltip(propertyId, event) {
  const data = propertyData[propertyId]
  if (!data) return
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
    tooltipCloseTimeout = null
  }
  const tooltip = document.getElementById("tooltip")
  if (!tooltip) return
  const tooltipFloorEl = document.querySelector("#tooltipFloor")
  const tooltipAreaEl = document.querySelector("#tooltipArea")
  const floorRow = tooltipFloorEl ? tooltipFloorEl.closest(".info-row") : null
  const areaRow = tooltipAreaEl ? tooltipAreaEl.closest(".info-row") : null
  if (floorRow) floorRow.style.display = ""
  if (areaRow) areaRow.style.display = ""
  const tooltipUnit = document.getElementById("tooltipUnit")
  const tooltipFloor = document.getElementById("tooltipFloor")
  const tooltipArea = document.getElementById("tooltipArea")
  if (tooltipUnit) tooltipUnit.textContent = data.unit || data.name
  if (tooltipFloor) tooltipFloor.textContent = data.floor || "N/A"
  if (tooltipArea) tooltipArea.textContent = data.area
  const tooltipUnitRow = tooltipUnit ? tooltipUnit.closest(".info-row") : null
  const iconUnit = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-icon.icon-unit") : null
  if (iconUnit) {
    iconUnit.style.display = ""
  }
  const tooltipText = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-text") : null
  if (tooltipText) {
    const firstChild = tooltipText.firstChild
    if (!firstChild || (firstChild.nodeType === 3 && !firstChild.textContent.includes("Căn:"))) {
      const cănText = document.createTextNode("Căn: ")
      tooltipText.insertBefore(cănText, tooltipText.firstChild)
    } else if (firstChild.nodeType === 1) {
      const cănText = document.createTextNode("Căn: ")
      tooltipText.insertBefore(cănText, firstChild)
    }
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
function showCustomTooltip(content, event) {
  if (tooltipCloseTimeout) {
    clearTimeout(tooltipCloseTimeout)
    tooltipCloseTimeout = null
  }
  const tooltip = document.getElementById("tooltip")
  if (!tooltip) return
  const tooltipUnit = document.getElementById("tooltipUnit")
  const tooltipFloor = document.getElementById("tooltipFloor")
  const tooltipArea = document.getElementById("tooltipArea")
  if (tooltipUnit) tooltipUnit.textContent = content
  if (tooltipFloor) tooltipFloor.textContent = ""
  if (tooltipArea) tooltipArea.textContent = ""
  const tooltipFloorEl = document.querySelector("#tooltipFloor")
  const tooltipAreaEl = document.querySelector("#tooltipArea")
  const floorRow = tooltipFloorEl ? tooltipFloorEl.closest(".info-row") : null
  const areaRow = tooltipAreaEl ? tooltipAreaEl.closest(".info-row") : null
  if (floorRow) floorRow.style.display = "none"
  if (areaRow) areaRow.style.display = "none"
  const tooltipUnitRow = tooltipUnit ? tooltipUnit.closest(".info-row") : null
  const iconUnit = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-icon.icon-unit") : null
  if (iconUnit) {
    iconUnit.style.display = "none"
  }
  const tooltipText = tooltipUnitRow ? tooltipUnitRow.querySelector(".info-text") : null
  if (tooltipText) {
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
let roleSecondModalFirstCurrentSlide = 0
function moveRoleSecondModalFirstSlide(direction) {
  const slides = document.querySelectorAll('.role-second-modal-first-slide')
  const track = document.querySelector('.role-second-modal-first-track')
  if (!slides.length || !track) return
  slides[roleSecondModalFirstCurrentSlide].classList.remove('active')
  roleSecondModalFirstCurrentSlide = (roleSecondModalFirstCurrentSlide + direction + slides.length) % slides.length
  slides[roleSecondModalFirstCurrentSlide].classList.add('active')
  const offset = -roleSecondModalFirstCurrentSlide * 100
  track.style.transform = `translateX(${offset}%)`
}
let roleSecondModalFirstCurrentSlideMobile = 0
function moveRoleSecondModalFirstSlideMobile(direction) {
  const slides = document.querySelectorAll('.role-second-modal-first-slide-mobile')
  const track = document.querySelector('.role-second-modal-first-track-mobile')
  if (!slides.length || !track) return
  slides[roleSecondModalFirstCurrentSlideMobile].classList.remove('active')
  roleSecondModalFirstCurrentSlideMobile = (roleSecondModalFirstCurrentSlideMobile + direction + slides.length) % slides.length
  slides[roleSecondModalFirstCurrentSlideMobile].classList.add('active')
  const offset = -roleSecondModalFirstCurrentSlideMobile * 100
  track.style.transform = `translateX(${offset}%)`
}
let roleFrameCurrentSlide = 0
function moveRoleFrameSlide(direction) {
  const slides = document.querySelectorAll('.desktop-only .frame-slide')
  const track = document.querySelector('.desktop-only .frame-slider-track')
  if (!slides.length || !track) return
  slides[roleFrameCurrentSlide].classList.remove('active')
  roleFrameCurrentSlide = (roleFrameCurrentSlide + direction + slides.length) % slides.length
  slides[roleFrameCurrentSlide].classList.add('active')
  const offset = -roleFrameCurrentSlide * 100
  track.style.transform = `translateX(${offset}%)`
}
let roleFrameCurrentSlideMobile = 0
function moveRoleFrameSlideMobile(direction) {
  const slides = document.querySelectorAll('.mobile-only .frame-slide-mobile')
  const track = document.querySelector('.mobile-only .frame-slider-track-mobile')
  if (!slides.length || !track) return
  slides[roleFrameCurrentSlideMobile].classList.remove('active')
  roleFrameCurrentSlideMobile = (roleFrameCurrentSlideMobile + direction + slides.length) % slides.length
  slides[roleFrameCurrentSlideMobile].classList.add('active')
  const offset = -roleFrameCurrentSlideMobile * 100
  track.style.transform = `translateX(${offset}%)`
}