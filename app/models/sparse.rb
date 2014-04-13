class Sparse
  def initialize(dimentions)
    @dimentions = dimentions.sort
    @points = []
  end

  def <<(point)
    @points<< @dimentions.map{|d| point[d] || 0}
  end

  def vote(paragons)
    paragon_pull = paragons.map

    @points.each{|p|
    #Calculate pull factors for each paragon
      pull_factors = paragons.map{|pr| distance(p,pr)/paragons.length}
      mover = paragons[pull_factors.index(pull_factors.max)]
      paragon_pull[paragons.index(mover)] = sub(paragon_pull[paragons.index(mover)],p,pull_factors.max)
    }
    paragon_pull
  end

  def sub(point,influencer,factor)#returns a new point/vector
    #point = point || Array.new(influencer.length, 0)
    point.map.with_index{|c,i| c-(influencer[i]*factor)}
  end

  def distance(p1,p2)#return scalar
    res = 0
    p1.each.with_index{|c,i| res += c*p2[i]}
    res
  end

  def to_s
    @points.map{|p| "<#{p.join("|")}>"}.join("\n")
  end
  
  def self.read(file_name)
    p "Reasing vector file #{file_name}"
    r = File.open(file_name,"rb" )
    dimentions = r.gets.gsub("\r\n","").split(",")
    p "loaded dimentions #{dimentions.inspect}"
    s = Sparse.new(dimentions)
    
    while line = r.gets#.gsub("\r\n","")
      p "adding #{line}"
      s<<ActiveSupport::JSON.decode(line)
    end
    r.close
    
    s
  end

end
