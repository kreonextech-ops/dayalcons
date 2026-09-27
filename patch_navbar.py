with open('crm/src/components/navbar/index.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace floating nav classes with a full-width flat nav
s1 = 'className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]"'
r1 = 'className="sticky top-0 z-50 flex flex-row items-center justify-between bg-white/80 p-3 border-b border-gray-100 backdrop-blur-xl dark:bg-[#0b1437cc] dark:border-navy-700 w-full -mx-4 px-6 md:-mx-2 md:px-4 xl:-mx-2 xl:px-4 shadow-sm"'
c = c.replace(s1, r1)

# Remove the big title block
s2 = '''<p className="shrink text-[33px] capitalize text-navy-700 dark:text-white mt-2">
            <Link
              to="#"
              className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
            >
              {brandText}
            </Link>
          </p>'''
c = c.replace(s2, '')

# Make the right-side container flat and smaller
s3 = 'className="relative mt-[3px] flex h-[61px] w-auto flex-grow items-center justify-end gap-4 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-auto md:flex-grow-0 md:gap-4 xl:w-auto xl:gap-4"'
r3 = 'className="relative flex h-[40px] w-auto flex-grow items-center justify-end gap-3 px-2 py-1 md:w-auto md:flex-grow-0 md:gap-4 xl:w-auto xl:gap-4"'
c = c.replace(s3, r3)

# Remove padding from the breadcrumbs wrapper so it sits flush
c = c.replace('<div className="h-6 w-[224px] pt-1">', '<div className="h-6 w-auto pt-1 flex items-center gap-2">')
c = c.replace('className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"', 'className="text-lg font-bold capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"')

with open('crm/src/components/navbar/index.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
